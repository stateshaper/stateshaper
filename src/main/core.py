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


    def step(self, index=None): 
        self.morph_array()
        self.iteration = self.iteration + 1 
        return self.get_token() 


    def reverse(self):
        if self.iteration > 1:
            value = self.current_state[len(self.current_state)-1]
            self.iteration = self.iteration - 1
            self.current_state = self.current_state[:len(self.current_state)-1] 
            old_value = [self.reverse_morph(value)]
            print(f"Old value calculated from reverse morph: {old_value} at iteration: {self.iteration}")
            print(f"Current state before reverse morph: {self.current_state} at iteration: {self.iteration}")
            self.current_state = old_value + self.current_state
            print(f"Current state after reverse morph: {self.current_state} at iteration: {self.iteration}")
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
        print(f"Calculating reverse morph with current value: {value} at iteration: {self.iteration}")
        return ((value - self.constants["d"]) * pow((round((self.constants["c"] * self.constants["c"]) / self.constants["a"]) * self.constants["b"] * self.iteration) % self.mod, -1, self.mod)) % self.mod


    def new_value(self, value):
        return self.morph_logic(value) 


    def morph_logic(self, value):
        print(f"Calculating new value with current value: {value} at iteration: {self.iteration}")
        return (self.constants["d"] + round((self.constants["c"] * self.constants["c"])/self.constants["a"]) * self.constants["b"] * self.iteration * value) % self.mod
    

    def jump(self, index, i=0, value=None):
        value = self.current_state[0] if not value else value
        if i < index:
            value = self.morph_logic(value)
            print(f"Jumping to index: {index} with value: {value} at iteration: {self.iteration}")
            i = i + 1
            self.iteration = self.iteration + 1
            return self.jump(index=index, i=i, value=value) 
        value = self.morph_logic(value)
        self.current_state = [value]
        self.iteration = self.iteration + 1
        return value + 1
        