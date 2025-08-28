---
title: "Django Signals: A Complete Guide to Event-Driven Programming"
date: 2022-11-17
toc_sticky: false
---




Django signals provide a way to decouple applications by allowing certain senders to notify a set of receivers when some action has taken place. They're essentially Django's implementation of the observer pattern, enabling you to execute code when certain events occur in your application.

## What are Django Signals?

Django signals are a way to allow decoupled applications to get notified when certain actions occur elsewhere in the application. They're useful for:

## Built-in Django Signals

Django provides several built-in signals that you can listen to:

### Model Signals

```python
from django.db.models.signals import (
    pre_save, post_save, pre_delete, post_delete,
    pre_migrate, post_migrate, m2m_changed
)
```

### Request/Response Signals

```python
from django.core.signals import (
    request_started, request_finished, got_request_exception
)
```

### Database Wrapper Signals

```python
from django.db.backends.signals import connection_created
```

## How Signals Work

### 1. Signal Definition

Signals are defined using the `Signal` class:

```python
from django.dispatch import Signal

# Define a custom signal
user_registered = Signal()
order_placed = Signal(providing_args=["order", "user"])
```

### 2. Signal Connection

Connect a receiver function to a signal:

```python
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
```

### 3. Signal Disconnection

Disconnect a receiver from a signal:

```python
from django.dispatch import receiver
from django.db.models.signals import post_save

@receiver(post_save, sender=User)
def my_handler(sender, instance, created, **kwargs):
    pass

# Disconnect the signal
post_save.disconnect(my_handler, sender=User)
```

## Common Use Cases

### 1. User Profile Creation

```python
# models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
```

### 2. Audit Logging

```python
# models.py
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
    ]
    
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # Generic foreign key to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    class Meta:
        ordering = ['-timestamp']

# signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User

@receiver(post_save)
def log_model_changes(sender, instance, created, **kwargs):
    if sender == User:  # Skip User model to avoid recursion
        return
    
    action = 'CREATE' if created else 'UPDATE'
    AuditLog.objects.create(
        action=action,
        user=getattr(instance, 'user', None),
        content_object=instance
    )

@receiver(post_delete)
def log_model_deletion(sender, instance, **kwargs):
    if sender == User:  # Skip User model to avoid recursion
        return
    
    AuditLog.objects.create(
        action='DELETE',
        user=getattr(instance, 'user', None),
        content_object=instance
    )
```

### 3. Cache Invalidation

```python
# signals.py
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Article

@receiver([post_save, post_delete], sender=Article)
def invalidate_article_cache(sender, instance, **kwargs):
    # Clear specific cache keys
    cache.delete(f'article_{instance.id}')
    cache.delete('article_list')
    
    # Clear cache for author's articles
    cache.delete(f'author_articles_{instance.author.id}')
```

### 4. Email Notifications

```python
# signals.py
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from .models import Order

@receiver(post_save, sender=Order)
def send_order_confirmation_email(sender, instance, created, **kwargs):
    if created:
        # Send confirmation email to customer
        context = {'order': instance}
        html_message = render_to_string('emails/order_confirmation.html', context)
        text_message = render_to_string('emails/order_confirmation.txt', context)
        
        send_mail(
            subject=f'Order Confirmation #{instance.id}',
            message=text_message,
            from_email='noreply@example.com',
            recipient_list=[instance.customer.email],
            html_message=html_message
        )
        
        # Send notification to admin
        send_mail(
            subject=f'New Order #{instance.id}',
            message=f'New order received from {instance.customer.name}',
            from_email='noreply@example.com',
            recipient_list=['admin@example.com']
        )
```

### 5. Custom Business Logic

```python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product, Inventory

@receiver(post_save, sender=Product)
def update_inventory_status(sender, instance, **kwargs):
    try:
        inventory = instance.inventory
        if inventory.quantity <= 0:
            inventory.status = 'OUT_OF_STOCK'
        elif inventory.quantity <= inventory.low_stock_threshold:
            inventory.status = 'LOW_STOCK'
        else:
            inventory.status = 'IN_STOCK'
        inventory.save()
    except Inventory.DoesNotExist:
        pass
```

## Advanced Signal Patterns

### 1. Conditional Signal Handling

```python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order

@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, **kwargs):
    # Only process if status actually changed
    if instance.tracker.has_changed('status'):
        old_status = instance.tracker.previous('status')
        new_status = instance.status
        
        if new_status == 'SHIPPED':
            send_shipping_notification(instance)
        elif new_status == 'DELIVERED':
            send_delivery_confirmation(instance)
        elif new_status == 'CANCELLED':
            process_refund(instance)
```

### 2. Signal with Custom Arguments

```python
# signals.py
from django.dispatch import Signal

# Define signal with custom arguments
order_status_changed = Signal(providing_args=['order', 'old_status', 'new_status'])

# models.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .signals import order_status_changed

@receiver(post_save, sender=Order)
def emit_order_status_signal(sender, instance, **kwargs):
    if instance.tracker.has_changed('status'):
        order_status_changed.send(
            sender=sender,
            order=instance,
            old_status=instance.tracker.previous('status'),
            new_status=instance.status
        )

# receivers.py
@receiver(order_status_changed)
def handle_order_status_change(sender, order, old_status, new_status, **kwargs):
    print(f"Order {order.id} status changed from {old_status} to {new_status}")
```

### 3. Async Signal Handling

```python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from celery import shared_task
from .models import Order

@shared_task
def send_order_notification_async(order_id):
    order = Order.objects.get(id=order_id)
    # Send notification logic here
    pass

@receiver(post_save, sender=Order)
def queue_order_notification(sender, instance, created, **kwargs):
    if created:
        # Queue async task instead of sending immediately
        send_order_notification_async.delay(instance.id)
```

## Best Practices

### 1. Keep Signal Handlers Lightweight

```python
# Good: Lightweight signal handler
@receiver(post_save, sender=Order)
def update_order_count(sender, instance, created, **kwargs):
    if created:
        # Just update a counter
        instance.customer.order_count += 1
        instance.customer.save()

# Bad: Heavy operations in signal handler
@receiver(post_save, sender=Order)
def heavy_operation_in_signal(sender, instance, created, **kwargs):
    if created:
        # Don't do heavy operations here
        process_payment(instance)  # This should be in the view
        send_multiple_emails(instance)  # Use Celery instead
        update_external_systems(instance)  # Use async task
```

### 2. Avoid Signal Recursion

```python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=Profile)
def update_user(sender, instance, **kwargs):
    # This could cause recursion!
    # instance.user.save()  # Don't do this
    pass
```

### 3. Use Signal Disconnection for Testing

```python
# tests.py
from django.test import TestCase
from django.db.models.signals import post_save
from .models import User, Profile

class UserProfileTest(TestCase):
    def setUp(self):
        # Disconnect signals for testing
        post_save.disconnect(receiver=create_user_profile, sender=User)
    
    def tearDown(self):
        # Reconnect signals after testing
        post_save.connect(create_user_profile, sender=User)
    
    def test_user_creation(self):
        user = User.objects.create_user(username='testuser')
        # Test without signal interference
        self.assertFalse(hasattr(user, 'profile'))
```

### 4. Organize Signals Properly

```python
# apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'myapp'
    
    def ready(self):
        import myapp.signals  # Import signals when app is ready
```

## Performance Considerations

### 1. Signal Overhead

Signals add overhead to database operations. Consider:

```python
# Use bulk operations when possible
User.objects.bulk_create(users)  # Signals won't fire for bulk_create

# Or disable signals temporarily
from django.db.models.signals import post_save
post_save.disconnect(create_user_profile, sender=User)
# Do bulk operations
post_save.connect(create_user_profile, sender=User)
```

### 2. Database Queries in Signals

```python
# Bad: N+1 queries in signal
@receiver(post_save, sender=Order)
def update_customer_stats(sender, instance, **kwargs):
    # This could cause many queries
    instance.customer.total_orders = instance.customer.order_set.count()
    instance.customer.save()

# Good: Use select_related or prefetch_related
@receiver(post_save, sender=Order)
def update_customer_stats(sender, instance, **kwargs):
    # Use cached property or annotation
    instance.customer.refresh_from_db()
    instance.customer.update_total_orders()
```

## Debugging Signals

### 1. Signal Debugging

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# signals.py
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender=Order)
def log_order_creation(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Order {instance.id} created by {instance.customer}")
```

### 2. Signal Testing

```python
# tests.py
from django.test import TestCase
from django.db.models.signals import post_save
from unittest.mock import patch

class SignalTest(TestCase):
    def test_signal_fires(self):
        with patch('myapp.signals.send_email') as mock_send:
            order = Order.objects.create(customer=self.customer)
            mock_send.assert_called_once()
```

## Conclusion

Django signals are a powerful tool for implementing event-driven programming patterns. They help decouple applications and make your code more maintainable. However, they should be used judiciously, as they can add complexity and performance overhead if not managed properly.

Remember to:

---

*Signals are a great way to implement the observer pattern in Django, but like any powerful tool, they should be used thoughtfully and with consideration for their impact on your application's performance and maintainability.*
