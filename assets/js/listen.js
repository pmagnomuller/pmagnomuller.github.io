(function () {
  "use strict";

  var MAX_UTTERANCE = 180;
  var KEEP_ALIVE_MS = 10000;
  var SKIP_SELECTOR = [
    "pre",
    "script",
    "style",
    "noscript",
    "svg",
    "figure",
    "button",
    ".highlight",
    ".mermaid",
    ".language-mermaid",
    ".clipboard-copy-button",
    ".listen",
  ].join(",");

  function supported() {
    return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  }

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function splitSentences(text) {
    var parts = text.match(/[^.!?]+(?:[.!?]+|$)/g);
    if (!parts) return [text];
    return parts.map(normalize).filter(Boolean);
  }

  function splitLong(text, max) {
    if (text.length <= max) return [text];
    var words = text.split(" ");
    var out = [];
    var buf = "";
    for (var i = 0; i < words.length; i++) {
      var next = buf ? buf + " " + words[i] : words[i];
      if (next.length > max && buf) {
        out.push(buf);
        buf = words[i];
      } else {
        buf = next;
      }
    }
    if (buf) out.push(buf);
    return out;
  }

  function chunkParagraphs(paragraphs) {
    var utterances = [];
    for (var i = 0; i < paragraphs.length; i++) {
      var sentences = splitSentences(paragraphs[i]);
      var buf = "";
      for (var j = 0; j < sentences.length; j++) {
        var pieces = splitLong(sentences[j], MAX_UTTERANCE);
        for (var k = 0; k < pieces.length; k++) {
          var piece = pieces[k];
          var combined = buf ? buf + " " + piece : piece;
          if (combined.length > MAX_UTTERANCE && buf) {
            utterances.push(buf);
            buf = piece;
          } else {
            buf = combined;
          }
        }
      }
      if (buf) utterances.push(buf);
    }
    return utterances;
  }

  function extractParagraphs(titleEl, contentEl) {
    var paragraphs = [];
    if (titleEl) {
      var title = normalize(titleEl.innerText);
      if (title) paragraphs.push(title);
    }
    if (!contentEl) return paragraphs;

    var clone = contentEl.cloneNode(true);
    clone.querySelectorAll(SKIP_SELECTOR).forEach(function (node) {
      node.remove();
    });
    clone.querySelectorAll("code.language-mermaid").forEach(function (node) {
      var pre = node.closest("pre");
      (pre || node).remove();
    });

    var blockSelector = "p, h1, h2, h3, h4, h5, h6, li, blockquote";
    clone.querySelectorAll(blockSelector).forEach(function (el) {
      var parent = el.parentElement;
      if (parent && parent.closest(blockSelector)) return;
      var text = normalize(el.innerText);
      if (text) paragraphs.push(text);
    });

    return paragraphs;
  }

  function pickVoice(voices) {
    var english = voices.filter(function (voice) {
      return /^en(-|$)/i.test(voice.lang);
    });
    var pool = english.length ? english : voices;
    return (
      pool.find(function (voice) {
        return /google/i.test(voice.name) && /en-US/i.test(voice.lang);
      }) ||
      pool.find(function (voice) {
        return voice.localService && /en-US/i.test(voice.lang);
      }) ||
      pool.find(function (voice) {
        return /en-US/i.test(voice.lang);
      }) ||
      pool[0] ||
      null
    );
  }

  function track(action, extra) {
    var payload = Object.assign(
      {
        event: "blog_listen",
        action: action,
        post_url: extra && extra.post_url,
        post_title: extra && extra.post_title,
      },
      extra || {}
    );

    try {
      document.dispatchEvent(new CustomEvent("blog:listen", { detail: payload }));
    } catch (err) {
      /* ignore */
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", "blog_listen", {
        event_category: "listen",
        event_label: payload.post_url,
        listen_action: action,
      });
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
    if (typeof window.plausible === "function") {
      window.plausible("Listen", {
        props: { action: action, path: payload.post_url },
      });
    }
  }

  function init(root) {
    var toggle = root.querySelector("[data-listen-toggle]");
    var stopBtn = root.querySelector("[data-listen-stop]");
    var speedEl = root.querySelector("[data-listen-speed]");
    var statusEl = root.querySelector("[data-listen-status]");
    var iconEl = root.querySelector("[data-listen-icon]");
    var labelEl = root.querySelector("[data-listen-toggle-label]");
    var titleEl = document.querySelector("#page-title");
    var contentEl = document.querySelector(".page__content");
    var meta = {
      post_url: root.getAttribute("data-post-url") || window.location.pathname,
      post_title: root.getAttribute("data-post-title") || (titleEl && normalize(titleEl.innerText)) || "",
    };

    var utterances = [];
    var index = 0;
    var rate = 1;
    var voice = null;
    var currentUtterance = null;
    var keepAlive = null;
    var state = "idle";

    function setStatus(text) {
      if (statusEl) statusEl.textContent = text || "";
    }

    function setPlayingUi(playing) {
      toggle.setAttribute("aria-pressed", playing ? "true" : "false");
      if (labelEl) labelEl.textContent = playing ? "Pause" : state === "paused" ? "Resume" : "Listen";
      if (iconEl) {
        iconEl.classList.remove("fa-play", "fa-pause");
        iconEl.classList.add(playing ? "fa-pause" : "fa-play");
      }
      if (stopBtn) stopBtn.hidden = state === "idle";
    }

    function clearKeepAlive() {
      if (keepAlive) {
        clearInterval(keepAlive);
        keepAlive = null;
      }
    }

    function startKeepAlive() {
      clearKeepAlive();
      keepAlive = setInterval(function () {
        if (state === "playing" && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, KEEP_ALIVE_MS);
    }

    function finish(reason) {
      clearKeepAlive();
      currentUtterance = null;
      index = 0;
      state = "idle";
      setPlayingUi(false);
      if (reason === "error") {
        setStatus("Couldn't start playback.");
      } else if (reason === "unavailable") {
        setStatus("This browser has no voice to read with.");
      } else if (reason === "empty") {
        setStatus("Nothing to read on this page.");
      } else if (reason === "complete") {
        setStatus("Finished");
        track("complete", meta);
      } else {
        setStatus("");
      }
    }

    function speakAt(fromIndex) {
      if (fromIndex >= utterances.length) {
        finish("complete");
        return;
      }

      index = fromIndex;
      var utterance = new SpeechSynthesisUtterance(utterances[index]);
      utterance.rate = rate;
      utterance.lang = "en-US";
      if (voice) utterance.voice = voice;
      currentUtterance = utterance;

      utterance.onend = function () {
        if (state !== "playing" || currentUtterance !== utterance) return;
        speakAt(index + 1);
      };

      utterance.onstart = function () {
        if (index === 0) track("play", meta);
      };

      utterance.onerror = function (event) {
        if (!event || event.error === "interrupted" || event.error === "canceled") return;
        if (event.error === "synthesis-unavailable" || event.error === "synthesis-failed") {
          finish("unavailable");
          return;
        }
        finish("error");
      };

      state = "playing";
      setPlayingUi(true);
      setStatus("Listening " + (index + 1) + " of " + utterances.length);
      startKeepAlive();
      window.speechSynthesis.speak(utterance);
    }

    function loadVoices() {
      var voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) voice = pickVoice(voices);
    }

    function prepareText() {
      utterances = chunkParagraphs(extractParagraphs(titleEl, contentEl));
      root.setAttribute("data-listen-chunks", String(utterances.length));
      return utterances.length;
    }

    function play() {
      loadVoices();
      if (!utterances.length && !prepareText()) {
        finish("empty");
        return;
      }

      if (state === "paused") {
        state = "playing";
        setPlayingUi(true);
        setStatus("Listening " + (index + 1) + " of " + utterances.length);
        startKeepAlive();
        window.speechSynthesis.resume();
        if (!window.speechSynthesis.speaking) speakAt(index);
        track("resume", meta);
        return;
      }

      window.speechSynthesis.cancel();
      state = "playing";
      speakAt(0);
    }

    function pause() {
      if (state !== "playing") return;
      state = "paused";
      window.speechSynthesis.pause();
      clearKeepAlive();
      setPlayingUi(false);
      setStatus("Paused " + (index + 1) + " of " + utterances.length);
      track("pause", meta);
      if (!window.speechSynthesis.paused && !window.speechSynthesis.speaking) {
        /* Safari sometimes ignores pause(); keep the index so Resume restarts the chunk. */
      }
    }

    function stop() {
      if (state === "idle") return;
      window.speechSynthesis.cancel();
      track("stop", meta);
      finish("stop");
    }

    toggle.addEventListener("click", function () {
      if (state === "playing") pause();
      else play();
    });

    if (stopBtn) {
      stopBtn.addEventListener("click", stop);
    }

    if (speedEl) {
      speedEl.addEventListener("change", function () {
        rate = parseFloat(speedEl.value) || 1;
        if (state === "playing") {
          window.speechSynthesis.cancel();
          speakAt(index);
        }
      });
    }

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    loadVoices();

    window.addEventListener("pagehide", function () {
      if (state !== "idle") window.speechSynthesis.cancel();
      clearKeepAlive();
    });

    root.hidden = false;
    setStatus("Browser voice");
    setPlayingUi(false);
  }

  function boot() {
    var root = document.querySelector("[data-listen]");
    if (!root) return;
    if (!supported()) return;
    init(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
