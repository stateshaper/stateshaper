import random
import operator

class SyntheticData:


    def __init__(self, token=1, absolute_needed=True, decimal_needed=False, round_rules=2, min_value=-9999, max_value=9999, **kwargs):

        self.token = token
        self.absolute_needed = absolute_needed
        self.decimal_needed = decimal_needed
        self.round_rules = round_rules
        self.min_value = min_value
        self.max_value = max_value

        self.constants = None
        self.equations = {}
        self.custom_equations = []

        self.operators = {
            "+": "add",
            "-": "sub",
            "*": "mul",
            "/": "truediv",
            "%": "mod",
            "**": "pow",
            "==": "eq",
            "!=": "ne",
            "<": "lt",
            "<=": "le",
            ">": "gt",
            ">=": "ge",
            "&": "and_",
            "|": "or_"
        }
        self.math = ["add","sub","mul","truediv","pow"]
        self.conditions = ["eq","ne","lt","le","gt","ge","and_","or_"]

        print("\n\n")
        a = 467
        b = 48
        c = 99


        # for i in range(10):
        #     self.get_value(i)

        # print(self.equations)
        self.custom_equation(token=5, operators=["-", "-", "-"])
        self.get_value(round_rules=2, decimal_needed=True, max_value=156, absolute_needed=False)




    def set_token(self, token):
        self.token = token


    def set_absolute_needed(self, condition):
        self.absolute_needed = condition


    def set_round_rules(self, value):
        self.round_rules = value


    def set_min_value(self, value):
        self.min_value = value


    def set_max_value(self, value):
        self.max_value = value


    def custom_equation(self, token=None, operators=["+", "-", "*"], modifiers=[3, 17, 23, 37]):
        token = self.token if not token else token
        equation = []

        while len(operators) > 0:
            math = {} 
            math["equation"] = getattr(operator, self.operators[operators[0]])
            math["values"] = [token, (self.get_constant(modifiers[0]) * modifiers[1])] if len(modifiers) > 0 else [token, self.get_constant(len(equation))]
            modifiers.pop(0)
            operators.pop(0)
            equation.append(math)

        self.equations[str(len(list(self.equations)))] = math
        return equation
    
    
    def get_value(self, index=0, absolute_needed=None, remove_equation=False, decimal_needed=None, round_rules=None, min_value=None, max_value=None, equation=None):
        try:
            index = str(index)
            absolute_needed = self.absolute_needed if not absolute_needed else absolute_needed
            decimal_needed = self.decimal_needed if not decimal_needed else decimal_needed
            max_value = self.max_value if not max_value else max_value
            round_rules = self.round_rules if not round_rules else round_rules
            operation = self.equations[index]["equation"] if not equation else equation["equation"]
            value = abs(operation(self.equations[index]["values"][0], self.equations[index]["values"][1])) if absolute_needed == True else operation(self.equations[index]["values"][0], self.equations[index]["values"][1])
            value = self.mod_equation(value, min_value, max_value) 
            value = self.round_equation(value, decimal_needed, round_rules)
            self.equations.pop(index) if remove_equation == True else None
            print("\n\nvalue returned")
            print(value)
            return value
        except:
            print("\n\nno equations have been created ")
            return 0


    def mod_equation(self, value, min_value, max_value):
        return value % min_value if value < 0 else value % max_value


    def round_equation(self, value, decimal_needed, round_rules):
        return round(value, round_rules) if round_rules else value if decimal_needed == True else int(value)
    

    # BASE FUNCTION TO CREATE CONSTANTS LIST
    def create_constants(self, numbers=None, length=3, increment=2, mix=False):
        self.constants = {}
        numbers = self.get_constants(length=length, increment=increment, mix=mix) if not numbers else numbers
        start = 97
        for number in numbers:
            self.constants[chr(start)] = number
            start += 1
        return self.constants


    def get_constants(self, length, increment=2, mix=False):
        constants = []
        start = 3
        
        for _ in range(length):
            increment = random.randint(1, 99) if mix == True else increment
            constants.append(start)
            start = start + increment

        return constants


    def get_constant(self, token=None, multiplier=1):
        token = self.token if not token else token
        return (list(self.constants.values())[token * multiplier % len(list(self.constants.values()))]) if self.constants is not None and isinstance(list(self.constants.values())[0], int) else (list(self.create_constants().values())[token * multiplier % len(list(self.constants.values()))])




SyntheticData()