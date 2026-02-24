import operator
import sys

class Stateshaper:

    def __init__(self, initial_state=1, constants={"a": 3, "b": 5, "c": 7, "d": 11}, mod=9973):

        if isinstance(initial_state, int) == False:
            self.current_state = [int(x) % mod for x in initial_state]
            self.original_state = [int(x) % mod for x in initial_state]
        else:
            self.current_state = [initial_state]
            self.original_state = [initial_state]
    
        self.constants = constants
        self.mod = mod
        self.iteration = 1 
        self.prior_index = 0
        self.token_array = []

        self.custom_morph = None

        self.operators = [
            operator.add,
            operator.sub,
            operator.mul,
            operator.floordiv,
            operator.pow
        ]

        self.operator_count = 5


    def step(self): 
        self.morph_array()
        self.iteration += 1
        return self.get_token() % 2


    def reverse(self):
        if self.iteration > 1:
            value = self.current_state[len(self.current_state)-1]
            self.iteration = self.iteration - 1
            self.current_state = self.current_state[:len(self.current_state)-1] 
            old_value = [self.reverse_morph(value)]
            self.current_state = old_value + self.current_state
        return self.get_token() 


    def get_token(self):
        return self.current_state[0]
    

    def generate_tokens(self, amount):
        return [self.step() for _ in range(amount)]


    def morph_array(self):
        value = self.current_state[0]
        self.current_state = self.current_state[1:]
        self.current_state.append(self.new_value(value))


    def reverse_morph(self, value):
        return ((value - self.constants["d"]) * pow((round((self.constants["c"] * self.constants["c"]) / self.constants["a"]) * self.constants["b"] * self.iteration) % self.mod, -1, self.mod)) % self.mod


    def new_value(self, value):
        return int(self.morph_logic(value)) 


    def morph_logic(self, value):
        if not self.custom_morph:
            return (self.constants["d"] + (self.constants["c"] * round(self.constants["c"]/self.constants["a"])) * self.constants["b"] * self.iteration * value) % self.mod  
        else:
            # print(f"Using custom morph: {self.custom_morph}")
            custom_value = self.custom_logic()
            # print(f"Custom logic value: {custom_value}")
            return (custom_value  * value) % self.mod
    

    def jump(self, index):
        tokens = [self.step() for _ in range(index)]
        return tokens[len(tokens)-1]


    def custom_logic(self, iteration=1):
        operators = []
        if self.custom_morph:
            operators = self.custom_morph
        else:
            while len(operators) < self.operator_count:
                operators.append(self.operators[(self.iteration_value(iteration, len(operators)+1) + self.iteration_value(iteration * iteration, len(operators)+1)) % len(self.operators)])
        
        value = sum([i(self.constants["a"], self.constants["c"]) if operators.index(i) % 3 * iteration == 0 else i(self.constants["d"], self.constants["b"]) if operators.index(i) % 5 * iteration == 0 else i(self.constants["c"], self.constants["a"]) for i in operators])

        return value 
          

    def iteration_value(self, iteration, i):
        return list(self.constants.values())[(i + iteration) % len(list(self.constants.values()))] * i * iteration + i if iteration % 3 + iteration == 0 else list(self.constants.values())[(i * i * iteration * iteration) % len(list(self.constants.values()))] + i * i * iteration * iteration if iteration % 5 + i == 0 else list(self.constants.values())[(i + i * i + iteration) % len(list(self.constants.values()))] ** i + i * i + iteration
    
