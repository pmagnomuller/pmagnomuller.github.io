---
title: "SQLAlchemy Upsert: A Complete Guide to Insert or Update Operations"
date: 2023-11-05
toc_sticky: false
---


An upsert operation is a combination of an update and an insert operation in a single statement. It's a useful operation when you want to update a row if it exists or insert it if it doesn't. In this blog post, we'll explore how to perform an upsert operation in SQLAlchemy, a popular SQL toolkit and ORM for Python.

Assuming that you have already set up your SQLAlchemy environment and connected to your database, let's get started!

Step 1: Define the table structure

The first step is to define the structure of the table that you want to upsert data into. For example, if you have a table called students with columns id, name, age, and score, you can define it as follows:

python
Copy code
from sqlalchemy import Column, Integer, String, Float, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    score = Column(Float)
Step 2: Create the session

The next step is to create a session that we’ll use to communicate with the database:

python
Copy code
engine = create_engine('postgresql://user:password@localhost/mydatabase')
Base.metadata.create_all(engine)
from sqlalchemy.orm import sessionmaker
Session = sessionmaker(bind=engine)
session = Session()
Step 3: Perform the upsert

Now, we are ready to perform the upsert operation. We’ll use the merge() method of the session object to merge the existing row with the new data, or to insert a new row if the primary key doesn't exist. Here’s an example:

python
Copy code
# Example data to be upserted
data = {'id': 1, 'name': 'John Doe', 'age': 25, 'score': 85.5}

# Upsert the data
student = Student(**data)
session.merge(student)

# Commit the transaction
session.commit()
In this example, we are upserting a new row with the ID of 1, name of John Doe, age of 25, and score of 85.5. If a row with an ID of 1 already exists, it will be updated with the new data. Otherwise, a new row will be inserted with the given data.

Note that the merge() method returns the merged object, which can be used to obtain the primary key of the row if it was inserted. If it was updated, the primary key will remain the same.

And that’s it! With just a few lines of code, we’ve performed an upsert operation in SQLAlchemy. It's a convenient way to ensure that your database remains up-to-date with the latest data without having to write complicated SQL statements.

I hope this blog post has been helpful. If you have any questions or suggestions, please feel free to leave a comment below. Thanks for reading!
