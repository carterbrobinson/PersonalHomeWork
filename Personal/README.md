# Git Fit Goals

## Deployed Application

The application is deployed at the following URL:

-Client and Server: [URL](https://gitfitgoalssessions.onrender.com/)

## Resource Overview

Git Fit Goals is a web app built with Vue.js for the client-side and Node.js for the server-side. It allows users to set their fitness goals, calculate macros and find exercises based on muscle groups.

### Attributes

- `myGoal`: The user's fitness goal.
- `frequency`: How often the user plans to work towards their goal.
- `duration`: The time frame the user sets for achieving their goal.
- `why`: The reason behind the user's goal.
- `when`: The preferred time of day for working towards the goal.

### Data Model/Shcema

The data model/schema for the Git Fits Goal's resource is as follows:

```javascript

{
    _id: ObjectId,
    myGoal: String,
    frequency: String,
    duration: String,
    why: String,
    when: String 
}
```

## REST Endpoints

|Name   		            |Method   |Path           |
|:--------------------------|:--------|:--------------|
|Retreive goal collection   |GET      |/goals         |
|Retrieve goal member       |GET      |/goals/:id     |
|Create goal member         |POST     |/goals         |
|Update goal member         |PUT      |/goals/:id     |
|Delete goal member         |DELETE   |/goals/:id     |
|Retrieve nutrition data    |GET      |/nutrition     |
|Retrieve exercise data     |GET      |/exercise      |
