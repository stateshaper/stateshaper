# *SYNTHETIC DATA PLUGIN*

This plugin file assists in creating a set of rules to generate deterministic numerical tokens. 

Custom equations can be built that derive values from a token in the output stream. 

These values can be used in applications for many things, including quality assurance testing, machine learning training and drawing on-screen graphics.

The primary benefit is that an unlimited sequence of values can be memorized and re-created from a storage size of only a few bytes. The data is lossless, can be jumped to at any point by index, and can be traversed/reversed as needed. 

Included in this file are instructions for using the SyntheticData class plugin and an example of how it can be used in a real application.


***Important*** 

<br>

- The class variables should be handled carefully. Memorized output depends on this, unless the same pattern of changing the variables is used every time the output is produced. Each class function contains options to modify the class variables if consistency is used to call them. 

- All parameters need (name=value) assignments when passed.

<br>
<br>

## Example

<br>
<br>

1. Initialize the *Stateshaper* engine.

<br>

```python
from stateshaper import Stateshaper

# here we will use a custom initial starting state. the default starting state is 1. using a custom starting state isn't necessary unless you want output that varies from the initial starting state. any positive whole number can be used here.
stateshaper = Stateshaper(data=tokens_rule, initial_state=123)

stateshaper.define_engine()

stateshaper.start_engine()

stateshaper.run_engine()
```

<br>
<br>

2. Create an instance of the *SyntheticData* class.

<br>

```python
# retrieve a token from the main engine. 
token = stateshaper.one_token() 

# @param 'token' (integer, default=1) - the initial token for the data. the token needs to be redefined for each set of output. for example, for one test sequence, all data derived for that instance is based on the current token. the default value is only a placeholder to prevent errors. the value is intended to come from the main stateshaper output stream. it can be passed once per class instantiation, or re-defined within the current object as needed. 
# @param 'absolute_needed' (boolean, default=True) - this determines if there will be negative numbers in the output. True indicates postive numbers only, False allows for negative numbers in the final data. 
# @param 'decimal_needed' (boolean, default=True) - indicates if a decimal value needs to be included, or if the value is to be rounded to a whole number.
# @param 'round_rules' (integer, default=2) - how many numbers the decimal should be rounded to. only relevant if decimal_needed is set to True
# @param 'min_value' (integer/float, default=-9999) - the lowest possible value the output should include. 
# @param 'max_value' (integer/float, default=9999) - the maximum possible value the output should include. 

# we will show an example where the token we just retrieved is passed, and only whole numbers are needed in the output. All other parameters will assume their default values.
synthetic_data = SyntheticData(token=token, decimal_needed=False)
```

<br>
<br>

3. Create an equation to modify the current token. This can be tailored to fit a specific use. In this example, we will use a shape graphic. You can get the equation from the functions return, or access it later in the 'equations' dataset.

<br>

```python
# @param 'token' (integer, default=None) - this can be a custom token, but is usually meant to be the token from the main stateshaper output stream. using a custom value here can effect determinism. not needed to be passed with the function. this is the driving factor of what makes the return value unique. 
# @param 'operators' (list, default=["+", "-", "*"]) - the sequence of operations for the equation. they will be performed in order. a list included options can be found at the top of the class file. 
# @param 'modifiers' (list, default=[3, 7]) - these values help add variety to the return value. they affect the value that is used in operations with the token. modifying them is not necessary, but doing so is recommended and does help prevent repeated data in longer streams of output. 
equation = synthetic_data.custom_equation(operators=["**", "+", "/"], modifiers=[3, 17, 23, 37])
```

<br>
<br>

4. Once the equation is created, get a value from it.

<br>

```python
# @param 'index' (integer/string, default=0) - stands for the key in the 'equations' dataset where the equation is stored. only needed if the equation is not stored in a single variable. 
# @param 'absolute_needed' (boolean, default=False) - determines if the value should be positive only or also account for negative.
# @param 'remove_equation' (boolean, default=False) - indicates if the equation used should be removed from the global class 'equations' object.
# @param 'decimal_needed' (boolean, default=False) - indicates if the return value should allow for decimals or round to a whole number.
# @param 'round_rules' (integer, default=2) - how many numbers the decimal should be rounded to. only relevant if decimal_needed is set to True. 
# @param 'min_value' (integer/float, default=-9999) - the lowest possible value the output should include. 
# @param 'max_value' (integer/float, default=9999) - the maximum possible value the output should include. 

# in this example we will use the default parameter values, using the equation that was created in the previous step. 
# lets say the example value created here is 5678.
value = get_value(equation=equation)
```

<br>
<br>

5. Use the value in a function in your app. You can tailor the value to fit your needs in the previous steps, or account for the type of values you'll get in the app. Here we will assume the user wants a value between 1-9999. This is the type of output that will be created based on the previous options chosen in the *SyntheticData* class. 

<br>

***This is a mock class shown to demonstrate how one of the created values can be used. Only part of the class will be shown.***

<br>

```python
# initializing a class for self driving car.
self_driving = SelfDriving() 

# set the map attributes based on the passed value.
self_driving.map_attributes(value) 



def map_attributes(value): 
    # initialize a dictionary to store map attributes in

    attributes = {
        # 0 (calm sunny day) < .5 (light rain and wind) < 1 (category 5 hurricane)
        "weather": None, 

        # 0 (smooth surface, new road) < .5 (regular dirt road) < 1  (jagged, rocky offroad)
        "terrain": None, 

        # 0 (-120 degrees F) < .5 (60 degrees F) < 1  (120 degrees f)
        "temperature": None,

        # 0 (you're all alone) < .5 (regular traffic) < 1  (gridlock) 
        "traffic": None,

        # 0 (driving in open plains) < .5 (a few pedestrians) < 1  (a mountain road without a barrier, chance of rockslide, animal, cyclist, etc.) 
        "hazards": None 
    }

    # get the attributes. each has their own function that defines a special set of rules to derive the needed value.
    attributes["weather"] = get_weather(value)
    attributes["terrain"] = get_terrain(value)
    attributes["temperature"] = get_temperature(value)
    attributes["traffic"] = get_traffic(value)
    attributes["hazards"] = get_hazards(value)


# an example function. the rest of the functions will follow these conventions. in this case, a higher token value will equate to rougher weather. the value will be seemingly random, but within the rules that have been set.
def get_weather(value):
    # use these constants as part of the math in the equation. more constants allows for further variation in the output if needed. these values can be specialized to allow for a certain range of output depending on the input value. 
    constants = [3, 5, 7, 9, 11]

    # define the highest possible value. 
    # the current max value is 9999. the highest constant is 11.
    # result of the following = 109989
    weather_max = max_value * constants[4]

    # normalize the value in order to achieve the needed constant. in this case, large values connect to larger constants used.
    # remember the value is 5678, with an original max value of 9999. 
    # result of the following = 11
    normalize = round((value / max_value) * 20)

    # get the position of the needed constant
    # result of the following = 2
    position = round(normalize / 5)

    # the constant will be chosen based on the created value. keep it within range of 100 to allow for reduction to needed range. 
    # the value is 5678, the constant is 7
    # result of the following = 39746
    value = value * constants[position] 

    # keep the number within range of the max weather value (109989)
    # result of the following = .361
    value = value / weather_max

    # return the value
    # final value = .361
    return value
```

<br> 
<br>
Lets assume all of the attributes are created this way. These values can then be used in an ML Training scenario. To create new values, the token from the next step must be assigned as the new token, and the previous functions need to be called again. 
<br>
6. An example of how the created values can be used.
<br>


```python


pass_test = run_test(attributes)

def run_test(attributes):
    # A map has been created using the attributes created above. The vehicle being used has the following characteristics:
    vehicle_data = {
        "speed": .76,
        "acceleration": .82,
        "weight": .45,
        "torque": .8,
        "efficiency": .24
    }

    test_results = []

    # The map has other attributes for each mile we won't show. Here is an example of the vehicle running through the map. Each mile has variance data that slightly modifies the attribute list.
    for mile in current_map:
        current_attributes = [i * mile[i] for i in attributes]
        test_results.append({"mile": current_map.index(mile), "data": test_data(vehicle_data, attributes_list)})

    return test_results


# This is a pseudocode function that compares attributes and looks for a point of failure. In real ML code, this would be more detailed, but the data that is used can also be created with Stateshaper.
def test_data(data, attributes):
    
