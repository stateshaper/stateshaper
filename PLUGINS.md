# *Plugins*

<h3><i>Needed to create data for a specific use</i></h3>

<br>

The functions in this example class demonstrate how values can be created based on a particular training attribute. 

The values created here are *seemingly random synthetic data*. The generated values can lean toward the direction of your choosing based on the equations used, or be completely random within a certain range. The variation of these values also depends on the equations used to create them, but are ultimately dependent on the current tokenized numeric value outputted by *Stateshaper*.

The numeric chain created by *Stateshaper* is also seemingly random, and when used as the key to derive values from, allows for many different types of test cases.

For this case, the example will be an outdoor AI security camera. The dataset is used to determine whether to flag an object as a concern. This is only an example for how this type of data can be created and might be used to train the AI.

<br> <br>

**You can pass the following code into the AI of your choice and ask it to generate this type of logic for your app's particular use.**

<br> 

We will be creating an example dataset in this format that can be used to train the AI in the camera.
```python
data = {
    height: .4,
    width: .32,
    heat: .34,
    # shows up on camera at slow pace. stops after 15 seconds. begins to move at 18 seconds, speeds up and exits the frame. 
    velocity: [{(.1, 0), (0, 15)}, {(0, .4), (18, 25)}],
    volume: [{(.2, 0), (0, 3)}, {(.6, 0), (15, 17)}, {(0, .2), (20, 25)}],
    duration: 25
}
```
<br> <br>

For each test, the data will be derived from the *Stateshaper* output using custom functions in the actual plugin file. 

```python
from stateshaper import Stateshaper

# call the stateshaper class. we won't pass any custom parameters here. the regular output can be used for what we need.
engine = Stateshaper()

# the plugin class is defined at the bottom of the file. 
plugin = Plugin()

engine.start_engine()


# for one test
token = engine.one_token()

test_data = plugin.get_data()


# for 10 tests
tokens = engine.run_engine(token_count=10)

test_data = []

for token in tokens:
    test_data.append(plugin.get_data(token))


# for 100 tests
tokens = engine.run_engine(token_count=100)

test_data = []

for token in tokens:
    test_data.append(plugin.get_data(token))



# the token can be used to derive the data we need. a different function can be called for each type of data. 

class Plugin:

    def __init__(self, token=1, **kwargs):
        self.token = token

        # constants to use in the equations allow for variation in the output. a more complex equation allows for even greater variation in the final values for each test. the constants can be used however is deemed necessary. there is no limit to the number of constants or their values, but it is recommended to have a value >2. these don't necessarily need to be global and can be defined for each function. this only matters if the equations are written for it to matter. for instance, if you want all values to be adjusted in correlation each test.  
        self.constants = {
            "a": 7,
            "b": 15,
            "c": 17,
            "d": 37
        }

 
    # an arbitrary equation is used to obtain a seemingly random number. the calculations can be as complicated as needed. the driving point in the equation is that the token is used as a modulus value. this allows for determinism in the return value as long as no random operations are used (ex: random.randint).
    def get_height(self):
        height = (self.constants["a"] * self.constants["b"] + self.constants["c"] * self.token) % self.token

        return int(height)


    # lets use a more complex equation for width. if the data is not related to another value, it is good to have equations to obtain it as unique as possible. 
    def get_width(self):
        width = (self.constants["c"] ** (self.constants["b"] + self.constants["d"]) ** (self.token + self.constants["b"])) % self.token

        return int(width)


    # for the velocity array, we need a more specialized return value. rules are defined for list length and when activity starts and stops. 
    def get_velocity(self):
        max_interval = 30
        max_velocity = 1
        data = []

        duration, length = self.velocity_data()

        if duration < max_interval:
            max_interval = duration

        timer = 0
        stop_velocity = 0
        while len(data) < length:
            start_time = timer
            start_velocity = 0 
            end_velocity = 0
            if (timer + self.token + self.constants["a"]) % 3 == 0:
                timer = timer + ((self.token * (self.constants["c"] + self.constants["a"])) % max_interval)
            if (timer + self.token + self.constants["a"]) % 5 == 0: 
                timer = timer + ((self.token * (self.constants["d"] + self.constants["b"])) % max_interval)
            if (timer + self.token + self.constants["a"]) % 7 == 0:
                timer = timer + ((self.token * (self.constants["a"] + self.constants["a"])) % max_interval)          
            else: 
                timer = timer + ((self.token ** (self.constants["d"] * self.constants["b"])) % max_interval)

            if (start_velocity + self.token * self.constants["c"]) % 3 == 0:
                start_velocity = start_velocity + ((self.token * (self.constants["a"] + self.constants["a"])) % max_velocity)
            if (start_velocity + self.token * self.constants["c"]) % 5 == 0: 
                start_velocity = start_velocity + ((self.token * (self.constants["b"] + self.constants["c"])) % max_velocity)
            if (start_velocity + self.token * self.constants["c"]) % 7 == 0:
                start_velocity = start_velocity + ((self.token * (self.constants["c"] + self.constants["a"])) % max_velocity)          
            else: 
                start_velocity = stop_velocity 

            start_velocity = round(start_velocity / 100 , 2)
            end_velocity = round(abs((start_velocity - (self.token * (self.constants["a"] ** self.constants["c"])) % max_velocity)) / 100, 2)

            end_time = timer
            data.append([(start_velocity, start_time), (end_velocity, end_time)])

        return data



    def velocity_data(self):
        max_duration = 600
        duration = (self.constants["d"] * self.token) % max_duration 
        max_length = int(duration / 10) * 2
        length = int((self.constants["c"] * self.token) % max_length) + 1

        return duration, length


    def velocity_duration(self):
        max_duration = 600
        duration = (self.constants["d"] * self.token) % max_duration 
        max_length = int(duration / 10) * 2
        return int((self.constants["c"] * self.token) % max_duration)


    # the rest of the functions to derive values follow similar conventions


    # call this function from your parent class for each separate test to create and retrieve the dataset
    def get_data(self, token):
        self.token = token
        data = self.create_data()

        return data

    # defines the current dataset by assigning each item the values created by their corresponding auxillary functions
    def create_data(self):
        data = {}
        data["height"] = self.get_height()
        data["width"] = self.get_width()
        data["heat"] = self.get_heat()
        data["velocity"] = self.get_velocity()
        data["volume"] = self.get_volume()
        data["duration"] = self.get_duration()

        return data
```
