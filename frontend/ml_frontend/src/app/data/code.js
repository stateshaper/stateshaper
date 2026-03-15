export const code =  `
              import random
              import sys

              from .BuildEnvironment import BuildEnvironment
              from .data.vehicles import vehicles

              class MachineLearning:

                  def __init__(self, token=1, **kwargs):
                      self.vehicle = {
                          "torque": 0,                # 0 (pulls nothing) - 1 (pulls anything)
                          "acceleration": 0,          # 0-60 rating | 0 (stopped) - 1 (instant)
                          "speed": 0,                 # top speed | 0 (stopped) - 1 (200mph)
                          "durability": 0,            # against environment | (anything harms it) - 1 (invincible)
                          "tread": 0,                 # grip on road | 0 (no grip) - 1 (super glue)
                          "size": 0,                  # space it fills | 0 (invisible) - 1 (mountain)
                          "tank": 0,                  # size of gas tank/battery charge | 0 (none) - 1 (infinite)
                          "efficiency": 0             # mpg or kwh | 0 (instant drain) - 1 (no drain)
                      }

                      self.attributes = {
                          "torque": self.get_torque,
                          "acceleration": self.get_acceleration,
                          "speed": self.get_speed,
                          "durability": self.get_durability,
                          "tread": self.get_tread,
                          "size": self.get_size,
                          "tank": self.get_tank,
                          "efficiency": self.get_efficiency,
                      }

                      self.tensors = {
                          "incline": 0,               # how steep is the road? | 0 (horizontal) - 1 (vertical)
                          "curve": 0,                 # curves in current range -1/4 mile < 1/4 mile | 0 (straight) - 1 (90 degree turn)
                          "temperature": 0,           # current outer temperature | 0 (-120 F) - 1 (120 F)
                          "space": 0,                 # amount of lanes in road | 0 (no space) - 1 (open pasture)
                          "traffic": 0,               # density fof traffic | 0 (just you) - 1 (traffic jam)
                          "traction": 0,              # tires grip on the road | 0 (iced/oil road) - 1 (perfect grip)
                          "abrasion": 0,              # is the road smooth, or uneven? | 0 (smooth pavement) - 1 (jagged offroad rocks)
                      }

                      self.environment = {
                          "incline": self.get_incline,          
                          "curve": self.get_curve,              
                          "temperature": self.get_temperature,  
                          "space": self.get_space,              
                          "traffic": self.get_traffic,          
                          "traction": self.get_traction,        
                          "abrasion": self.get_abrasion,         
                      }

                      self.constants = {
                          "a": 3,
                          "b": 7,
                          "c": 11,
                          "d": 23,
                          "e": 31,
                          "f": 57,
                          "g": 65, 
                          "h": 71,
                          "i": 85,
                          "j": 91
                      }

                      self.mod = 100

                      self.build_environment = BuildEnvironment(token)
              
                      self.one_vehicle = None
                      self.one_tensors = None




                  def test_logic(self, token_count=5, one_vehicle=0, one_tensors=0):
                      for _ in range(token_count):
                          random_vehicle = True if random.randint(0, 100) / 100 < one_vehicle else None
                          random_tensors = True if random.randint(0, 100) / 100 < one_tensors else None
                          self.current_test(random.randint(1, 9999), one_vehicle=random_vehicle, one_tensors=random_tensors)


                  def current_test(self, token=None, one_vehicle=None, one_tensors=None): 
                      token = random.randint(1, 9999) if not token else token
                      self.build_environment = BuildEnvironment(token)
                      vehicle = self.get_vehicle(token) if not one_vehicle or self.one_vehicle == None else self.one_vehicle
                      self.one_vehicle = vehicle 
                      tensors = self.get_tensors(token) if not one_tensors or self.one_tensors == None  else self.one_tensors
                      self.one_tensors = tensors

                      print("New ML Training Test Created")
                      print({"vehicle": vehicle, "tensors": tensors})

                      environment = self.build_environment.create_environment(token)
                      return {"vehicle": vehicle, "tensors": tensors, "environment": environment}


                  def get_vehicle(self, token):
                      vehicle = token % len(vehicles)
                      return vehicles[vehicle]
                  

                  def get_tensors(self, token):
                      tensors = {}
                      for item in self.environment.items():
                          tensors[item[0]] = item[1](token)
                      return tensors


                  def get_torque(self, token):
                      return  round(((((token * self.constants["b"]) * self.constants["d"]) % self.mod) / self.mod), 2)


                  def get_acceleration(self, token):
                      return round(((((token * token * self.constants["a"]) * self.constants["e"]) % self.mod) / self.mod), 2)


                  def get_speed(self, token):
                      return round(((((token + (token * self.constants["c"]) * self.constants["f"]) * token) % self.mod) / self.mod), 2)


                  def get_durability(self, token):
                      return round((((token * self.constants["f"] * self.constants["a"])) % self.mod) / self.mod, 2)


                  def get_tread(self, token):
                      return round((((abs(token-self.constants["f"]) * self.constants["h"] * self.constants["a"])) % self.mod) / self.mod, 2)
                  

                  def get_size(self, token):
                      return round((((token * token * self.constants["g"])) % self.mod) / self.mod, 2)


                  def get_tank(self, token):
                      return round((((token * self.constants["c"] * self.constants["j"] + self.constants["e"])) % self.mod) / self.mod, 2)


                  def get_efficiency(self, token):
                      return round((((token + token * self.constants["a"] * self.constants["f"])) % self.mod) / self.mod, 2)


                  def get_incline(self, token):
                      return round((((token + (token * self.constants["i"]) * self.constants["b"])) % self.mod) / self.mod, 2)


                  def get_curve(self, token):
                      return round((((token + self.constants["c"]) * (self.constants["e"] - self.constants["b"])) % self.mod) / self.mod, 2)


                  def get_temperature(self, token):
                      return round((((token * token * token) * (self.constants["d"] - self.constants["e"] + self.constants["i"])) % self.mod) / self.mod, 2)


                  def get_space(self, token):
                      return round(((token * self.constants["j"] * (self.constants["b"] + self.constants["c"] + self.constants["c"])) % self.mod) / self.mod, 2)


                  def get_traffic(self, token):
                      return round(((token + (self.constants["c"] * (self.constants["d"] + self.constants["e"]))) % self.mod) / self.mod, 2)
                  

                  def get_traction(self, token):
                      return round(((abs(token - (self.constants["a"] * (self.constants["d"] + self.constants["f"])))) % self.mod) / self.mod, 2)


                  def get_abrasion(self, token):
                      return round(((token * (self.constants["e"] * self.constants["f"] * self.constants["g"])) % self.mod) / self.mod, 2)


                      

                import random
                import sys
                from .data.environments import environment_data
                from .TripTimeline import TripTimeline

                class BuildEnvironment:


                    def __init__(self, token=1, **kwargs):
                        # trip length 1-100
                        # break into intervals
                        # transitions have increment/decrement style for each attribute based on neighboring intervals. ie low elevation -> high elevation incline number steadily rises between each interval's median, some values change instantly when needed. 
                        # intervals can overlap ie low elevation with rain or sun to high elevation with rain or sun. ex.: {"low_elevation": [1, 25], "sun": [1, 15], "rain": [15, 70], "high_elevation": [25, 100]}

                        # low to high elevation example
                        #
                        # low elevation interval = 25
                        # high elevation interval = 75
                        #
                        # trip 0-12.5 environment maintains values correlating to a low elevation, but vary within low elevation
                        # trip 12.5-50 values transition from low to high elevation
                        # trip 50-100 high elevation are maintained, but vary within high elevation

                        self.environments = ["coastal_warm","coastal_cold","foothills","mountains","valley","arctic","urban","town"]

                        self.constants = {
                            "temperature": {"a": 517, "b": 3, "c": 941},
                            "humidity": {"a": 89, "b": 777, "c": 141},
                            "light": {"a": 333, "b": 17, "c": 905},
                            "elevation": {"a": 701, "b": 255, "c": 39},
                            "curves": {"a": 11, "b": 893, "c": 477},
                            "road_size": {"a": 619, "b": 5, "c": 821},
                            "road_texture": {"a": 147, "b": 961, "c": 23},
                            "incline": {"a": 555, "b": 79, "c": 907},
                            "incline_variance": {"a": 271, "b": 999, "c": 61},
                            "traffic": {"a": 401, "b": 9, "c": 863},
                            "hazard_variance": {"a": 731, "b": 187, "c": 49},
                            "potential_hazard": {"a": 95, "b": 543, "c": 817},
                            "weather_variance": {"a": 667, "b": 1, "c": 359},
                            "weather_type": {"a": 213, "b": 887, "c": 27}
                        }

                        self.current_environment = {
                            "environment": "",
                            "temperature": 0,
                            "humidity": 0,
                            "light": 0, 
                            "elevation": 0, 
                            "curves": 0, 
                            "road_size": 0,
                            "road_texture": 0,
                            "incline": 0,
                            "incline_variance": 0, 
                            "traffic": 0, 
                            "hazard_variance": 0,
                            "potential_hazard": [],
                            "weather_variance": 0,
                            "weather_type": []
                        }

                        self.max_intervals = 6
                        self.trip_duration = 100
                        self.intervals = []
                        self.deviation = 20
                        self.token = token




                    def get_token(self, random=False):
                        return self.token if random == False else random.randint(1, 9999)


                    def set_token(self, token):
                        self.token = token


                    def create_environment(self, token, adjust=1):
                        print("start environment")
                        print(f"token: {token}")
                        intervals = []
                        interval_count = 1 + (token % self.max_intervals) + 1
                        print(f"interval count {interval_count}")
                        current = 0
                        while len(intervals) < interval_count: 
                            multiplier = 3 if len(intervals) % 2 == 0 else 5
                            interval_range = self.get_range(current, intervals, interval_count, token) 
                            environment = self.environments[(token * (len(intervals) + 1) * multiplier * adjust)  % len(self.environments)]
                            if self.check_included(intervals, environment) == False:
                                interval_range[1] = 100 if interval_count - len(intervals) < 2 else interval_range[1]
                                intervals.append({"environment": environment, "range": interval_range, "data": self.get_environment(token, environment, multiplier * adjust)})  
                            else:
                                adjust += 1
                                intervals[len(intervals)-1]["range"][1] = 100 if len(intervals) == interval_count else intervals[len(intervals)-1]["range"][1]
                            current = intervals[len(intervals)-1]["range"][1]
                            if current >= 100:
                                print("environments created")
                                print(intervals)
                                return intervals
                    

                    def check_included(self, intervals, environment):
                        return len([i for i in intervals if i["environment"] == environment]) > 0


                    def get_range(self, current, intervals, interval_count, token):
                        min_range = 10
                        remaining = self.trip_duration - current
                        start = current
                        end = current + (token % remaining) if len(intervals) < interval_count - 1 else 100
                        end = end + min_range if current - end < min_range else end
                        end = 100 if end > 100 or interval_count - len(intervals) < 2 else end
                        return [start, end]


                    def get_environment(self, token, environment, multiplier):
                        current_environment = {}
                        current_environment["environment"] = environment
                        for value in environment_data[environment].items():
                            current_environment[value[0]] = self.get_value(token, value[0], value[1], multiplier) if isinstance(value[1], list) == False else self.get_list(token, value[0], value[1], multiplier)
                        return current_environment


                    def get_deviation(self, token, constant):
                        return round(((((token + constant) % self.deviation) / self.deviation)/5), 2) if token % 2 == 0 else -round(((((token + constant) % self.deviation) / self.deviation)/5), 2)
                    

                    def get_constant(self, token, attribute, multiplier):
                        constants = [int(str(i[1])[:1]) % int(str(token*multiplier)[:1]) for i in self.constants[attribute].items()]
                        matching = min(constants)
                        return list(self.constants[attribute].values())[constants.index(matching)]


                    def get_value(self, token, environment, value, multiplier):
                        constant = self.get_constant(token, environment, multiplier)
                        final = round((value + self.get_deviation(token, constant)), 2) if environment != "hazard_variance" else value
                        return 0 if final < 0 else final if final < 1 else 1 
                    

                    def get_list(self, token, environment, value, multiplier):
                        constant = self.get_constant(token, environment, multiplier)
                        return value[(token * constant) % len(value)]
                    



                  import copy
                  import random
                  import sys
                  import time
                  from .data.environments import environment_data

                  class TripTimeline:


                      def __init__(self, **kwargs):
                          # trip length 1-100
                          # break into intervals
                          # transitions have increment/decrement style for each attribute based on neighboring intervals. ie low elevation -> high elevation incline number steadily rises between each interval's median, some values change instantly when needed. 
                          # intervals can overlap ie low elevation with rain or sun to high elevation with rain or sun. ex.: {"low_elevation": [1, 25], "sun": [1, 15], "rain": [15, 70], "high_elevation": [25, 100]}

                          self.max_counter = 100
                          self.trip_counter = 0 
                          self.trip_length = 100 #lets say 1 is 1 mile. nothing fancy yet (real times). irl 1 mile takes longer than 1 second.

                          self.run = False
                          self.end = False

                          self.hazard_fail = 2

                          self.trip_attributes =  {
                              "temperature": 0,
                              "humidity": 0,
                              "light": 0,
                              "elevation": 0,
                              "curves": 0,
                              "road_size": 0,
                              "road_texture": 0,
                              "incline": 0,
                              "incline_variance": 0,
                              "traffic": 0,
                              "hazard_variance": 0,
                              "weather_variance": 0,
                          }

                          self.constants = {
                              "temperature": {"a": 517, "b": 3, "c": 941},
                              "humidity": {"a": 89, "b": 775, "c": 141},
                              "light": {"a": 319, "b": 17, "c": 905},
                              "elevation": {"a": 701, "b": 255, "c": 39},
                              "curves": {"a": 11, "b": 893, "c": 477},
                              "road_size": {"a": 619, "b": 5, "c": 821},
                              "road_texture": {"a": 147, "b": 961, "c": 23},
                              "incline": {"a": 555, "b": 79, "c": 907},
                              "incline_variance": {"a": 271, "b": 959, "c": 61},
                              "traffic": {"a": 401, "b": 9, "c": 863},
                              "hazard_variance": {"a": 731, "b": 183, "c": 49},
                              "potential_hazard": {"a": 95, "b": 543, "c": 817},
                              "weather_variance": {"a": 667, "b": 1, "c": 359},
                              "weather_type": {"a": 213, "b": 887, "c": 27}
                          }

                          self.measured = {
                              "gradual": ["temperature", "humidity", "elevation", "incline", "light", "potential_hazard","road_size", "road_texture", "incline_variance", "traffic", "hazard_variance",  "weather_variance", "weather_type"]
                          }

                          self.hazard_data = []
                          self.steering_precision = []
                          self.speed_precision = [] 
                          self.stop_precision = [] 
                          self.rule_precision = []
                          self.start = False

                      


                      def reset_trip(self):
                          self.trip_counter = 0
                          self.end = False
                          self.run = False
                          self.start = False
                          self.token = 1
                          self.trip = None
                          self.current_trip = None
                          self.current_interval = None
                          self.total_trip = None
                          self.next_interval = None
                          self.trip_attributes =  {
                              "temperature": 0,
                              "humidity": 0,
                              "light": 0,
                              "elevation": 0,
                              "curves": 0,
                              "road_size": 0,
                              "road_texture": 0,
                              "incline": 0,
                              "incline_variance": 0,
                              "traffic": 0,
                              "hazard_variance": 0,
                              "weather_variance": 0,
                          }


                      def set_trip(self, token, trip):
                          if self.start == False:
                              self.token = token
                              self.trip = trip
                              self.current_trip = trip
                              self.current_interval = copy.deepcopy(trip[0])
                              self.total_trip = copy.deepcopy(trip[0])
                              self.start = True         
                              try:
                                  self.next_interval = trip[1] 
                              except:
                                  self.next_interval = None
                              

                      def trip_progress(self):
                          print(f"Current Interval: {self.current_interval['environment']}, Range: {self.current_interval['range']}")
                          print(f"{self.current_interval}")
                          if self.next_interval != None:
                              print(f"Next Interval: {self.next_interval['environment']}, Range: {self.next_interval['range']}")
                              print(f"{self.next_interval}")
                          

                      def start_trip(self):
                          self.end = False
                          if self.trip_counter >= self.current_interval["range"][1]:
                              self.current_interval = copy.deepcopy(self.next_interval) 
                              self.total_trip = copy.deepcopy(self.next_interval)
                          if len(self.current_trip) > 1 :
                              self.next_interval = self.check_next()
                              self.compare_intervals() if self.next_interval != None else None


                      def check_next(self):
                          try:
                              return self.trip[self.trip.index(self.current_interval)+1]
                          except:
                              print("No other environments in this trip.")
                              return None
                          

                      def compare_intervals(self):
                          print(f"trip counter {str(self.trip_counter)}")
                          for attribute in self.trip_attributes:
                              self.set_attribute(attribute) 
                          print(f"next trip interval set: {self.current_interval}")


                      def set_attribute(self, attribute):
                          self.trip_attributes[attribute] = self.change_rate(attribute) if attribute in self.measured["gradual"] else self.next_interval["data"][attribute]


                      def change_rate(self, attribute):
                          try: 
                              return round(((self.next_interval["data"][attribute] - self.current_interval["data"][attribute])) / ((self.current_interval["range"][1] - self.current_interval["range"][0])), 6)
                          except:
                              pass


                      def run_timer(self, one_trip=False, step=False):
                          if self.end == False:
                              self.trip_counter += 1
                              self.adjust_values()
                              self.end_check(one_trip, step)
                              return self.total_trip
                          return self.total_trip
                          

                      def adjust_values(self):
                          print(f"Trip Counter: {self.trip_counter}")
                          print(f"Environment: {self.current_interval['environment']}, Range: {self.current_interval['range']}")
                          print(self.token)
                          print(self.trip_attributes)
                          print(self.total_trip)
                          print(self.next_interval)
                          for attribute in self.trip_attributes:
                              self.total_trip["data"][attribute] = (self.total_trip["data"][attribute] + self.trip_attributes[attribute]) if attribute in self.measured["gradual"] else self.trip_attributes[attribute]
                              self.total_trip["data"][attribute] = .99 if self.total_trip["data"][attribute] >= .99 else self.total_trip["data"][attribute]
                              self.total_trip["data"][attribute] = 0 if self.total_trip["data"][attribute] < 0 else self.total_trip["data"][attribute]


                          if self.next_interval != None:
                              if self.trip_counter == self.next_interval["range"][0]:
                                  for attribute in self.trip_attributes:
                                      self.total_trip["data"][attribute] = round(self.total_trip["data"][attribute], 2) 
                                  self.interval_end()


                      def end_check(self, one_trip=False, step=False):
                          if (self.trip_counter >= self.trip_length and self.end == False) or one_trip == True and self.trip_counter >= self.current_interval["range"][1]:
                              print("end of trip")
                              print("hazards encountered")
                              print(self.hazard_data)
                              self.trip_data = {"hazard_data": self.hazard_data, "steering_precision": self.steering_precision, "speed_precision": self.speed_precision, "stop_precision": self.stop_precision, "rule_precision": self.rule_precision}
                              self.end = True
                          else:
                              self.run_timer() if step == False else None
                              

                      def interval_end(self):
                          print("end of interval")
                          print("next interval")
                          print(self.next_interval)
                          self.trip_progress()
              `