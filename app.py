
# import sys

# from stateshaper_ml import Stateshaper
# from MachineLearning import MachineLearning

# token_count = 1000
# plugin_size = 14000
# compare = ""
# state = 123
# constants = [111, 235, 7, 455]
# mod = 314159

# try:
#     with open("data.txt", "r") as f:
#         compare = f.read()
#         f.close()
# except:
#     pass

# if len(compare) < 1:    
#     compare = None


# # initialize the package
# # use a custom initial state to create a variation in output
# stateshaper = Stateshaper(initial_state=state, constants=constants, mod=mod)

# # start the engine to prepare it for output
# stateshaper.start_engine()

# # the custom class pertaining to the ml training scenario
# ml = MachineLearning()

# # create 50 tokens to derive data from
# tokens = stateshaper.run_engine(token_count=token_count)

# # create 50 sets of ml training data
# data = [ml.current_test(token) for token in tokens]

# with open("data.txt", "w") as f:
#     f.write(str(data))

# print()
# print(data)
# print("\n\n")
# print(f"\n{token_count} tokens of generated data is {len(str(data))} bytes")
# if compare:
#     if str(compare) == str(data):
#         print("\ncreated data matches full dataset without loss")
#     else:
#         print("\ncreated data does not match full dataset, if this is not the first run, there is a loss of data")
#         print("\n\n")
#         sys.exit(0)

# print(f"\n\n\nit is created from {len(str(state))} bytes (from initial state only, minimum stored data)")
# print(f"\nreduced to {round(len(str(state)) / len(data), 4)}% from created data")
# print(f"\n\n\nincluding plugins")
# print(f"\nit is created from {len(str(state)) + plugin_size} bytes (from initial state (stored) and plugin code (backend))")
# print(f"\nreduced to {round((len(str(state)) + plugin_size)/ len(data), 4)}% from created data with plugins")

# print(f"\n\n\nincluding custom params and plugins (max size required to create the data)")
# print(f"\nit is created from {len(str(state)) + plugin_size + len(''.join(map(str, constants))) + len(str(mod))} bytes (from initial state (stored) and plugin code (backend))")
# print(f"\nreduced to {round((len(str(state)) + plugin_size + len(''.join(map(str, constants))) + len(str(mod)))/ len(data), 4)}% from created data with plugins")

# print(f"\n\n\nMINIMUM size required to create the data (initial state only, no plugins or custom params): {str(len(str(state)))} bytes ({round(len(str(state)) / len(data), 4)}% the size of created data)")

# print(f"\nMAXIMUM size required to create the data (with plugins and custom params): {str(len(str(state)) + plugin_size + len(''.join(map(str, constants))) + len(str(mod)))} bytes ({round((len(str(state)) + plugin_size + len(''.join(map(str, constants))) + len(str(mod)))/ len(data), 4)}% the size of created data)")





# print("\n\n")



import streamlit as st
import sys
from io import StringIO
from contextlib import redirect_stdout

# Assuming these are your custom modules/packages
# If stateshaper_ml and MachineLearning are local files, place them in the repo
# If they are pip-installable, add to requirements.txt
from stateshaper_ml import Stateshaper
from MachineLearning import MachineLearning

st.title("Stateshaper Data Generator Demo")

st.markdown("""
Adjust the parameters below, then click **Start** to generate data and see compression stats.
""")

# ---------------- Inputs ----------------
# col1, col2 = st.columns(2)

# with col1:
token_count = st.number_input("Token Count", min_value=1, value=1000, step=100)
state = st.number_input("Initial State", value=123)

# with col2:
plugin_size = 14000
mod = st.number_input("Modulus", value=314159)

constants_str = st.text_input("Constants (comma-separated integers)", value="111,235,7,455")
try:
    constants = [int(x.strip()) for x in constants_str.split(",") if x.strip()]
except:
    constants = [111, 235, 7, 455]
    st.warning("Invalid constants format → using defaults [111, 235, 7, 455]")

compare = None
try:
    with open("data.txt", "r") as f:
        compare = f.read().strip()
except:
    pass

if st.button("Start Generation", type="primary"):
    with st.spinner("Generating data..."):
        # Capture all print output
        output_buffer = StringIO()
        with redirect_stdout(output_buffer):
            try:
                # Initialize
                stateshaper = Stateshaper(initial_state=state, constants=constants, mod=mod)
                stateshaper.start_engine()

                ml = MachineLearning()

                # Generate tokens and data
                tokens = stateshaper.run_engine(token_count=token_count)
                data = [ml.current_test(token) for token in tokens]

                # Save (ephemeral on Render)
                with open("data.txt", "w") as f:
                    f.write(str(data))

                # Original print logic
                print()
                print(data)
                print("\n\n")
                print(f"\n{token_count} tokens of generated data is {len(str(data))} bytes")

                if compare:
                    if str(compare) == str(data):
                        print("\ncreated data matches full dataset without loss")
                    else:
                        print("\ncreated data does not match full dataset, if this is not the first run, there is a loss of data")
                        print("\n\n")
                        # sys.exit(0)  # Commented – don't kill Streamlit session
                else:
                    print("\nNo previous data to compare.")

                data_len = len(str(data))
                state_len = len(str(state))

                print(f"\n\n\nit is created from {state_len} bytes (from initial state only, minimum stored data)")
                print(f"\nreduced to {round(state_len / data_len, 4) if data_len > 0 else 0}% from created data")

                print(f"\n\n\nincluding plugins")
                print(f"\nit is created from {state_len + plugin_size} bytes (from initial state (stored) and plugin code (backend))")
                print(f"\nreduced to {round((state_len + plugin_size) / data_len, 4) if data_len > 0 else 0}% from created data with plugins")

                custom_extra = len(''.join(map(str, constants))) + len(str(mod))
                print(f"\n\n\nincluding custom params and plugins (max size required to create the data)")
                print(f"\nit is created from {state_len + plugin_size + custom_extra} bytes")
                print(f"\nreduced to {round((state_len + plugin_size + custom_extra) / data_len, 4) if data_len > 0 else 0}% from created data with plugins")

                print(f"\n\n\nMINIMUM size required to create the data (initial state only, no plugins or custom params): {state_len} bytes ({round(state_len / data_len, 4) if data_len > 0 else 0}% the size of created data)")

                max_size = state_len + plugin_size + custom_extra
                print(f"\nMAXIMUM size required to create the data (with plugins and custom params): {max_size} bytes ({round(max_size / data_len, 4) if data_len > 0 else 0}% the size of created data)")

                print("\n\n")

            except Exception as e:
                print(f"\nError during execution: {str(e)}")
                import traceback
                print(traceback.format_exc())

        # Get captured output
        captured = output_buffer.getvalue()

        st.subheader("Output")

        if captured.strip():
            # Show raw print output in a scrollable code block (preserves formatting)
            st.markdown("**Console Output:**")
            st.code(captured, language="text")
        else:
            st.info("No output captured.")

        # Optional: show the generated data nicely
        if 'data' in locals():
            st.subheader("Generated Data Preview")
            st.json(data[:50])  # limit to avoid huge output; or use st.table(pd.DataFrame(data)) if small