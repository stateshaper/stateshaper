import streamlit as st
import sys
from io import StringIO
from contextlib import redirect_stdout

from stateshaper_ml import Stateshaper
from MachineLearning import MachineLearning

st.title("Stateshaper ML Training Data Test")

st.markdown("""
Creates examples of ML training data for self-driving cars. Intended to demonstrate Stateshaper's capability to reduce datasets by over 90% without loss.
""")

st.markdown("""
Adjust the parameters below, then click **Start** to generate data and see compression stats.
""")

st.markdown("""
<style>
.bottom-right-links {
    position: fixed;
    bottom: 12px;
    right: 12px;
    font-size: 32px;
    line-height: 1.3;
    z-index: 9999;
    background: rgba(255,255,255,0.85);
    padding: 4px 8px;
    border-radius: 6px;
}
.bottom-right-links a {
    text-decoration: none;
    color: #444;
    margin-right: 10px;
}
.bottom-right-links a:hover {
    text-decoration: underline;
}
</style>

<div class="bottom-right-links">
    <a href="https://github.com/stateshaper/stateshaper/blob/ml_use/README.md" target="_blank">docs</a>
    <a href="https://stateshaper-ml.vercel.app/" target="_blank">demo</a>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<style>
/* Number input text */
div[data-testid="stNumberInput"] input {
    font-size: 20px !important;
    font-weight: 600 !important;
}
            
/* Number input labels */
div[data-testid="stNumberInput"] label p {
    font-size: 18px !important;
    font-weight: 600 !important;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<style>
/* Basic markdown text */
div[data-testid="stMarkdownContainer"] p {
    font-size: 20px;
}

/* Optional: make headings a bit larger */
div[data-testid="stMarkdownContainer"] h1 { font-size: 36px; }
div[data-testid="stMarkdownContainer"] h2 { font-size: 30px; }
div[data-testid="stMarkdownContainer"] h3 { font-size: 24px; }
</style>
""", unsafe_allow_html=True)

# ── Inputs ────────────────────────────────────────────────────────────────
token_count = st.number_input("Token Count", min_value=1, value=1000, step=100)
state = st.number_input("Initial State", value=123)
plugin_size = 14000
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

changed_mod = False


if st.session_state.get("mod") != 314159 and st.session_state.get("mod") is not None:
    changed_mod = True
else:
    st.session_state.mod_value = st.session_state.get("mod", 314159)  # default to 314159 if not set

# Input widget
st.session_state.mod = st.number_input(f"Modulus (prime number)", value=st.session_state.get('mod_value'), step=1)
st.session_state.mod_value = st.session_state.mod

if st.session_state.mod_value != 314159:
    changed_mod = True
# Validation logic
if changed_mod == True:
    status_placeholder = st.empty()

    if st.session_state.mod:
        if is_prime(st.session_state.mod):
            status_placeholder.success(f"{st.session_state.mod:,} is prime.")
        else:
            # Find factors to show why it failed (optional but helpful)
            status_placeholder.error(f"{st.session_state.mod:,} is not prime. Please enter a prime number.")


col1, col2, col3, col4 = st.columns(4)

with col1:
    c1 = st.number_input("Constant 1", value=3, step=1)
with col2:
    c2 = st.number_input("Constant 2", value=5, step=1)
with col3:
    c3 = st.number_input("Constant 3", value=7, step=1)
with col4:
    c4 = st.number_input("Constant 4", value=11, step=1)

constants = [c1, c2, c3, c4]

# ── Compare previous data ─────────────────────────────────────────────────
compare = None
try:
    with open("data.txt", "r") as f:
        compare = f.read().strip()
except:
    pass

# ── Run button ────────────────────────────────────────────────────────────
if is_prime(st.session_state.mod):
    if st.button("Start Generation", type="primary"):
        with st.spinner("Generating data..."):
            output_buffer = StringIO()
            with redirect_stdout(output_buffer):
                try:
                    stateshaper = Stateshaper(initial_state=state, constants=constants, mod=st.session_state.mod)
                    stateshaper.start_engine()

                    ml = MachineLearning()

                    tokens = stateshaper.run_engine(token_count=token_count)
                    data = [ml.current_test(token) for token in tokens]

                    with open("data.txt", "w") as f:
                        f.write(str(data))

                    # Cleaned-up print format (same wording, better spacing)
                    print(f"\n{token_count} sets of synthetic ML TRAINING DATA have been generated from {len(str(data))} bytes\n\n")

                    if compare:
                        if str(compare) == str(data):
                            print("created data MATCHES full dataset without loss\n\n\n")
                        else:
                            print("created data DOES NOT MATCH full dataset, if this is not the first run using these parameters, there is a loss of data. otherwise, run the test again to match the current data\n\n\n")
                    else:
                        print("no previous data to compare.\n\n\n")

                    data_len = len(str(data))
                    state_len = len(str(state))

                    print("REDUCTION ANALYSIS\n------------------\n\n")

                    print(f"INITIAL STATE ONLY (no plugins or custom parameters)")
                    print(f"- the data is created from {state_len} bytes")
                    custom_state = float(round(state_len / data_len, 8)) if data_len > 0 else 0
                    print(f"- reduced to {custom_state:.8f}% from created data\n\n")

                    print("INCLUDING PLUGINS")
                    print(f"- the data is created from {state_len + plugin_size} bytes (from initial state (stored) and plugin code (backend))")
                    plugin_value = float(round((state_len + plugin_size) / data_len, 8)) if data_len > 0 else 0
                    print(f"- reduced to {plugin_value:.8f}% from created data with plugins\n\n")

                    custom_extra = len(''.join(map(str, constants))) + len(str(st.session_state.mod))
                    print("INCLUDING CUSTOM PARAMETERS AND PLUGIN (max size required to create the data)")
                    print(f"- the data is created from {state_len + plugin_size + custom_extra} bytes")
                    custom_value = float(round((state_len + plugin_size + custom_extra) / data_len, 8)) if data_len > 0 else 0
                    print(f"- reduced to {custom_value:.8f}% from created data with plugins\n\n")

                    minimum_value = float(round(state_len / data_len, 8)) if data_len > 0 else 0
                    print(f"MINIMUM size required to create the data (initial state only, no plugins or custom params): {state_len} bytes ({minimum_value:.8f}% the size of created data)\n\n")

                    max_size = state_len + plugin_size + custom_extra
                    max_value = float(round(max_size / data_len, 8)) if data_len > 0 else 0
                    print(f"MAXIMUM size required to create the data (with plugins and custom params): {max_size} bytes ({max_value:.8f}% the size of created data)\n\n")

                except Exception as e:
                    print(f"\nError during execution: {str(e)}")
                    import traceback
                    print(traceback.format_exc())

            captured = output_buffer.getvalue()

        # ── Output display ────────────────────────────────────────────────────────
        if captured:
            st.subheader("Output")

            st.markdown("""
                <style>
                div[data-testid="stTextArea"] textarea {
                    background-color: #fcfcfc !important;
                    color: #000000 !important;
                    -webkit-text-fill-color: #000000 !important;
                    font-family: 'Courier New', monospace;
                    border: 1px solid #dcdcdc !important;
                }
                div[data-testid="stTextArea"] textarea:focus {
                    color: #000000 !important;
                    -webkit-text-fill-color: #000000 !important;
                }
                div[data-testid="stTextArea"] [data-testid="stWidgetLabel"] p {
                    color: #111111 !important;
                    font-weight: 600 !important;
                }
                </style>
            """, unsafe_allow_html=True)

            st.text_area(
                "Captured output",
                value=captured,
                height=600,
                disabled=True
            )

            # ── Download button (only shown if file exists) ───────────────────────
            if 'data' in locals():
                try:
                    with open("data.txt", "rb") as f:
                        st.download_button(
                            label="Download data.txt",
                            data=f,
                            file_name="data.txt",
                            mime="text/plain"
                        )
                except:
                    pass  # silent fail if file not accessible

        else:
            st.info("No output captured.")

        # Optional preview
        if 'data' in locals():
            st.subheader("Generated Data Preview (first 50 items)")
            st.json(data[:50])