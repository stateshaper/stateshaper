import itertools
import operator
import sys

class Equation:
    def __init__(self, constants={"a": 1, "b": 1, "c": 1, "d": 1}, repeat=2):
        self.constants = constants
        self.repeat = repeat
        self.ops = [operator.add, operator.sub, operator.mul, operator.floordiv, operator.pow]
        self.symbols = {operator.add: "+", operator.sub: "-", operator.mul: "*", operator.floordiv: "//", operator.pow: "**"}

    def generate_permutations(self, iteration=1):
        """Yields one equation combo at a time."""
        # itertools.product creates a generator for all 3,125 combinations
        for combo in itertools.product(self.ops, repeat=self.repeat):
            results_list = []
            equation_parts = []

            for idx, op in enumerate(combo):
                # Logic to select the pair based on your rules
                if (idx % 3) * iteration == 0:
                    v1, v2 = self.constants["a"], self.constants["c"]
                elif (idx % 5) * iteration == 0:
                    v1, v2 = self.constants["d"], self.constants["b"]
                else:
                    v1, v2 = self.constants["c"], self.constants["a"]
                
                results_list.append(op)
                equation_parts.append(f"({v1}{self.symbols[op]}{v2})")

            # print("current equation parts:", equation_parts)
            # print(results_list)
            # print(op)
            # sys.exit()

            yield results_list

            # Combine the 5 parts into a single sum
            # final_sum = sum(results_list)
            # equation_str = " + ".join(equation_parts)
            
            # yield f"{equation_str} = {final_sum}"
        
        # self.repeat += 1  # Increment repeat for the next call to generate more complex equations


# --- Usage ---
# equation = Equation()

# use in loop for all constants permutations
# perm_gen = equation.generate_permutations(iteration=1)
# perm_gen = equation.generate_permutations(iteration=2)




# # To get one at a time manually:
# print(next(perm_gen)) # Combination 1
# print(next(perm_gen)) # Combination 2
# print(next(perm_gen)) # Combination 3
