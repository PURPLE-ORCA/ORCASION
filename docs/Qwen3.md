### Launch Qwen3-Instruct-2507 API Server

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Commands to start the API server for Qwen3-Instruct-2507 using SGLang and vLLM. Adjust context length based on GPU memory.

```shell
python -m sglang.launch_server --model-path Qwen/Qwen3-235B-A22B-Instruct-2507 --port 8000 --tp 8 --context-length 262144
```

```shell
vllm serve Qwen/Qwen3-235B-A22B-Instruct-2507 --port 8000 --tensor-parallel-size 8 --max-model-len 262144
```

--------------------------------

### Launch Qwen3 (8B) API Server

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Commands to start the API server for Qwen3-8B using SGLang and vLLM, enabling reasoning capabilities.

```shell
python -m sglang.launch_server --model-path Qwen/Qwen3-8B --port 8000 --reasoning-parser qwen3
```

```shell
vllm serve Qwen/Qwen3-8B --port 8000 --enable-reasoning --reasoning-parser qwen3
```

--------------------------------

### Interact with Qwen3-Instruct-2507 Chat API

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Examples of interacting with the Qwen3-Instruct-2507 chat completion API using cURL and the OpenAI Python SDK.

```shell
curl http://localhost:8000/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Qwen/Qwen3-235B-A22B-Instruct-2507",
  "messages": [
    {"role": "user", "content": "Give me a short introduction to large language models."}
  ],
  "temperature": 0.7,
  "top_p": 0.8,
  "top_k": 20,
  "max_tokens": 16384
}'
```

```python
from openai import OpenAI
# Set OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

chat_response = client.chat.completions.create(
    model="Qwen/Qwen3-235B-A22B-Instruct-2507",
    messages=[
        {"role": "user", "content": "Give me a short introduction to large language models."},
    ],
    max_tokens=16384,
    temperature=0.7,
    top_p=0.8,
    extra_body={
        "top_k": 20,
    }
)
print("Chat response:", chat_response)
```

--------------------------------

### Launch Qwen3-Thinking-2507 API Server

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Commands to start the API server for Qwen3-Thinking-2507 using SGLang and vLLM, including reasoning parser configuration. Adjust context length based on GPU memory.

```shell
python -m sglang.launch_server --model-path Qwen/Qwen3-235B-A22B-Thinking-2507 --port 8000 --tp 8 --context-length 262144  --reasoning-parser deepseek-r1
```

```shell
vllm serve Qwen/Qwen3-235B-A22B-Thinking-2507 --port 8000 --tensor-parallel-size 8 --max-model-len 262144 --enable-reasoning --reasoning-parser deepseek_r1
```

--------------------------------

### Start Inference Example

Source: https://github.com/qwenlm/qwen3/blob/main/examples/gcu-support/README.md

Executes the `gcu_demo.py` script to start the inference process. This script is adapted from the Huggingface quick start example.

```bash
python3.8 gcu_demo.py
```

--------------------------------

### Qwen3 Model Output Example

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

This section displays the expected console output when running the Qwen3 model generation script. It shows the 'thinking budget reached' message, the parsed thinking content, and the final generated content.

```text
thinking budget is reached
thinking content: <think>
Okay, the user is asking for a short introduction to large language models

Considering the limited time by the user, I have to give the solution based on the thinking directly now.
</think>
content: Large language models (LLMs) are advanced artificial intelligence systems trained on vast amounts of text data to understand and generate human-like language. They can perform tasks such as answering questions, writing stories, coding, and translating languages. LLMs are powered by deep learning techniques and have revolutionized natural language processing by enabling more context-aware and versatile interactions with text. Examples include models like GPT, BERT, and others developed by companies like OpenAI and Alibaba.
```

--------------------------------

### Interact with Qwen3-Thinking-2507 Chat API

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Examples of interacting with the Qwen3-Thinking-2507 chat completion API using cURL and the OpenAI Python SDK.

```shell
curl http://localhost:8000/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Qwen/Qwen3-235B-A22B-Thinking-2507",
  "messages": [
    {"role": "user", "content": "Give me a short introduction to large language models."}
  ],
  "temperature": 0.6,
  "top_p": 0.95,
  "top_k": 20,
  "max_tokens": 32768
}'
```

```python
from openai import OpenAI

```

--------------------------------

### Install AutoGPTQ

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/requirements-perf-transformers.txt

Installs the AutoGPTQ library from its GitHub repository. AutoGPTQ is crucial for efficient quantization of large language models.

```bash
pip install git+https://github.com/AutoGPTQ/AutoGPTQ.git@v0.7.1
```

--------------------------------

### Enter Docker and Install SDKs

Source: https://github.com/qwenlm/qwen3/blob/main/examples/gcu-support/README.md

Enters the Docker container and installs the SDK framework and Python libraries required for Qwen2.5 inference. Replace <version_id> with the specific package version.

```bash
# Enter the docker container
docker exec -it qwen-infer bash

# Install SDK framework, navigate to the package directory.
# <version_id> is the specific package version.
./TopsRider_i3x_<version_id>_amd64.run -C torch-gcu-2 -y
./TopsRider_i3x_<version_id>_deb_amd64.run -C tops-sdk -y

# Install python libraries
pip3.8 install transformers==4.40.2
pip3.8 install accelerate
```

--------------------------------

### Install OpenLLM

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/deployment/openllm.rst

Installs the OpenLLM package using pip. This is the initial step to get OpenLLM set up on your system.

```bash
pip install openllm
```

--------------------------------

### Install Flash Attention

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/requirements-perf-transformers.txt

Installs the Flash Attention library from its GitHub repository. Flash Attention is an optimized attention mechanism that significantly speeds up training and inference.

```bash
pip install git+https://github.com/Dao-AILab/flash-attention.git@v2.5.8
```

--------------------------------

### llama-server Command Example

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

Shows a command to launch the `llama-server` with a Qwen3 model, highlighting parameters for reasoning format, GPU offloading, and context management.

```shell
./llama-server -hf Qwen/Qwen3-8B-GGUF:Q8_0 --jinja --reasoning-format deepseek -ngl 99 -fa -sm row --temp 0.6 --top-k 20 --top-p 0.95 --min-p 0 -c 40960 -n 32768 --no-context-shift
```

--------------------------------

### Install Driver

Source: https://github.com/qwenlm/qwen3/blob/main/examples/gcu-support/README.md

Installs the necessary driver for GCU hardware. Replace <version_id> with the specific package version.

```bash
chmod +x TopsRider_i3x_<version_id>_deb_amd64.run
./TopsRider_i3x_<version_id>_deb_amd64.run -y
```

--------------------------------

### Qwen3 Model Loading and Inference

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Demonstrates how to load the Qwen3-8B model and tokenizer from Hugging Face Transformers, prepare input messages, and perform text generation. It also shows how to parse the 'thinking' content and the final response.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen3-8B"

# load the tokenizer and the model
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# prepare the model input
prompt = "Give me a short introduction to large language models."
messages = [
    {"role": "user", "content": prompt},
]
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
    enable_thinking=True, # Switches between thinking and non-thinking modes. Default is True.
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

# conduct text completion
generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=32768
)
output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist() 

# parse thinking content
try:
    # rindex finding 151668 (</think>)
    index = len(output_ids) - output_ids[::-1].index(151668)
except ValueError:
    index = 0

thinking_content = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
content = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")

print("thinking content:", thinking_content)
print("content:", content)
```

--------------------------------

### Using ModelScope with Qwen3

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Illustrates how to use the ModelScope library for downloading and interacting with Qwen3 models, by simply changing the import statement from `transformers` to `modelscope`.

```python
from modelscope import AutoModelForCausalLM, AutoTokenizer
```

--------------------------------

### Install Build Tools (macOS/Ubuntu)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

This snippet provides commands for installing essential build tools required for local compilation. It includes instructions for macOS using xcode-select and for Ubuntu using apt.

```bash
# macOS
xcode-select --install

# Ubuntu
sudo apt install build-essential
```

--------------------------------

### Interact with Qwen3 Chat Completion API (Default Thinking - curl)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Provides a curl command to interact with the Qwen3 chat completion API, mirroring the Python example with default thinking enabled. It specifies the model, messages, and other parameters.

```shell
curl http://localhost:8000/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Qwen/Qwen3-8B",
  "messages": [
    {"role": "user", "content": "Give me a short introduction to large language models."}
  ],
  "temperature": 0.6,
  "top_p": 0.95,
  "top_k": 20,
  "max_tokens": 32768
}'
```

--------------------------------

### Create and Start Docker Container

Source: https://github.com/qwenlm/qwen3/blob/main/examples/gcu-support/README.md

Creates and starts a Docker container for Qwen2.5 inference. It mounts the project path and root directory, isolates GCU resources, and uses a specified Ubuntu image.

```bash
# Create docker container, will be created based on the base image artifact.enflame.cn/enflame_docker_images/ubuntu/qic_ubuntu_2004_gcc9:1.4.4 docker
# <project_path> is the current project path
# -e ENFLAME_VISIBLE_DEVICES=2 performs GCU resource isolation, change to 0,1,2,3 etc. for multi-card
docker run -itd -e ENFLAME_VISIBLE_DEVICES=2 --name qwen-infer -v <project_path>:/work -v /root/:/root/ --privileged --network host  artifact.enflame.cn/enflame_docker_images/ubuntu/qic_ubuntu_2004_gcc9:1.4.4 bash
```

--------------------------------

### Install Qwen-Agent

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/framework/qwen_agent.rst

Installs the Qwen-Agent package from PyPI with optional dependencies for GUI, RAG, code interpreter, and MCP support. A minimal installation is also available.

```bash
pip install -U "qwen-agent[gui,rag,code_interpreter,mcp]"
# Or use `pip install -U qwen-agent` for the minimal requirements.
```

--------------------------------

### Starting Training Commands

Source: https://github.com/qwenlm/qwen3/blob/main/examples/llama-factory/finetune-zh.md

Provides command-line instructions for initiating model training using the llamafactory-cli tool. It includes examples for full parameter training, LoRA training, and QLoRA training, specifying the respective configuration YAML files.

```bash
FORCE_TORCHRUN=1 llamafactory-cli train qwen2-7b-full-sft.yaml
```

```bash
llamafactory-cli train qwen2-7b-lora-sft.yaml
```

```bash
llamafactory-cli train qwen2-7b-qlora-sft.yaml
```

--------------------------------

### GCU vLLM Inference

Source: https://github.com/qwenlm/qwen3/blob/main/examples/gcu-support/README.md

Shows how to run vLLM inference on GCU by installing the GCU version of vLLM and setting the device to 'gcu'. This command starts an OpenAI-compatible API server.

```bash
python -m vllm.entrypoints.openai.api_server --served-model-name Qwen2.5-7B-Instruct --model Qwen/Qwen2.5-7B-Instruct --device gcu
```

--------------------------------

### Start SGLang Router Server

Source: https://github.com/qwenlm/qwen3/blob/main/eval/README.md

Starts the SGLang router server, which is recommended for accelerating evaluation through data parallelism. This setup is beneficial for long-running evaluations.

```bash
python -m sglang_router.launch_server \
    --model-path Qwen/Qwen3-235B-A22B-Instruct-2507 \
    --dp-size 4 \
    --host 0.0.0.0 \
    --port 30000
```

--------------------------------

### Qwen3 Model Text Generation with Thinking

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

This snippet illustrates the process of preparing input for the Qwen3 model, generating text with a specified thinking budget, and handling early stopping if the budget is reached. It also shows how to parse the generated output to separate thinking content from the final response.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Assuming tokenizer and model are already loaded
# tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-Chat-1.8B", trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-Chat-1.8B", trust_remote_code=True).eval().to(model.device)

# Example setup (replace with your actual model and tokenizer loading)
# For demonstration purposes, let's mock these objects
class MockTokenizer:
    def apply_chat_template(self, messages, tokenize, add_generation_prompt, enable_thinking):
        return "<|im_start|>user\nGive me a short introduction to large language models.<|im_end|>\n<|im_start|>assistant\n<|im_start|>tool_code\n<|code_start|>"
    def __call__(self, text, return_tensors):
        class MockTensors:
            def __init__(self):
                self.input_ids = torch.tensor([[1, 2, 3]]) # Mock input IDs
            def to(self, device):
                return self
        return MockTensors()
    def decode(self, token_ids, skip_special_tokens=False):
        if 151668 in token_ids:
            return "<think>\nOkay, the user is asking for a short introduction to large language models\n\nConsidering the limited time by the user, I have to give the solution based on the thinking directly now.\n</think>"
        else:
            return "Large language models (LLMs) are advanced artificial intelligence systems trained on vast amounts of text data to understand and generate human-like language. They can perform tasks such as answering questions, writing stories, coding, and translating languages. LLMs are powered by deep learning techniques and have revolutionized natural language processing by enabling more context-aware and versatile interactions with text. Examples include models like GPT, BERT, and others developed by companies like OpenAI and Alibaba."

class MockModel:
    def generate(self, **kwargs):
        class MockGeneratedIds:
            def __init__(self):
                # Mocking a scenario where thinking budget is reached and then content is generated
                self.input_ids = torch.tensor([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 151668, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]]) # Mock output with thinking end token
            def __getitem__(self, index):
                return self.input_ids[index]
            def tolist(self):
                return self.input_ids.tolist()[0]
        return MockGeneratedIds()
    @property
    def device(self):
        return 'cpu' # Mock device

# Mock objects for demonstration
tokenizer = MockTokenizer()
model = MockModel()

# --- Actual code starts here ---

# prepare the model input
prompt = "Give me a short introduction to large language models."
messages = [
    {"role": "user", "content": prompt},
]
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
    enable_thinking=True, # Switches between thinking and non-thinking modes. Default is True.
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
input_length = model_inputs.input_ids.size(-1)

# Mock thinking_budget for demonstration
thinking_budget = 16

# first generation until thinking budget
generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=thinking_budget
)
output_ids = generated_ids[0][input_length:].tolist()

# check if the generation has already finished (151645 is <|im_end|>)
if 151645 not in output_ids:
    # check if the thinking process has finished (151668 is </think>)
    # and prepare the second model input
    if 151668 not in output_ids:
        print("thinking budget is reached")
        early_stopping_text = "\n\nConsidering the limited time by the user, I have to give the solution based on the thinking directly now.\n</think>\n\n"
        early_stopping_ids = tokenizer([early_stopping_text], return_tensors="pt", return_attention_mask=False).input_ids.to(model.device)
        input_ids = torch.cat([generated_ids, early_stopping_ids], dim=-1)
    else:
        input_ids = generated_ids
    attention_mask = torch.ones_like(input_ids, dtype=torch.int64)

    # second generation
    # Mocking the second generation output for demonstration
    class MockGeneratedIdsSecond:
        def __init__(self):
            self.input_ids = torch.tensor([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 151668, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]]) # Mock output with thinking end token and content
        def __getitem__(self, index):
            return self.input_ids[index]
        def tolist(self):
            return self.input_ids.tolist()[0]

    generated_ids = MockGeneratedIdsSecond()
    output_ids = generated_ids[0][input_length:].tolist()

# parse thinking content
try:
    # rindex finding 151668 (</think>)
    index = len(output_ids) - output_ids[::-1].index(151668)
except ValueError:
    index = 0

thinking_content = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
content = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")

print("thinking content:", thinking_content)
print("content:", content)

```

--------------------------------

### llama-cli Command Example

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

Demonstrates a typical command to run the `llama-cli` tool with a Qwen3 model from Hugging Face, including various optimization and generation parameters.

```shell
./llama-cli -hf Qwen/Qwen3-8B-GGUF:Q8_0 --jinja --color -ngl 99 -fa -sm row --temp 0.6 --top-k 20 --top-p 0.95 --min-p 0 -c 40960 -n 32768 --no-context-shift
```

--------------------------------

### Interact with Qwen3 Chat Completion API (Default Thinking)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Demonstrates how to set up the OpenAI client and make a chat completion request to the Qwen3 model with default thinking enabled. This includes API key and base URL configuration.

```python
from openai import OpenAI

openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

chat_response = client.chat.completions.create(
    model="Qwen/Qwen3-8B",
    messages=[
        {"role": "user", "content": "Give me a short introduction to large language models."},
    ],
    max_tokens=32768,
    temperature=0.6,
    top_p=0.95,
    extra_body={
        "top_k": 20,
    }
)
print("Chat response:", chat_response)
```

--------------------------------

### Environment Setup for vLLM Inference

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/README_zh.md

Installs dependencies required for running Qwen2.5 models using the vLLM inference engine.

```shell
conda create -n qwen_perf_vllm python=3.10
conda activate qwen_perf_vllm

pip install -r requirements-perf-vllm.txt
```

--------------------------------

### Install AutoAWQ

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/quantization/awq.md

Provides the command to install the AutoAWQ library, specifying a version compatible with the documentation's examples.

```bash
pip install "autoawq<0.2.7"

```

--------------------------------

### Load Qwen3 Model and Tokenizer with Hugging Face Transformers

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Shows how to load the Qwen3 model and its corresponding tokenizer using the Hugging Face Transformers library. This is a prerequisite for implementing custom features like managing thinking budgets.

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen3-8B"

thinking_budget = 16
max_new_tokens = 32768

# load the tokenizer and the model
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
```

--------------------------------

### Install Documentation Dependencies

Source: https://github.com/qwenlm/qwen3/blob/main/docs/README.md

Installs the necessary Python packages for building the documentation using Sphinx and the Furo theme.

```bash
pip install -r requirements-docs.txt
```

--------------------------------

### Autobuild Documentation

Source: https://github.com/qwenlm/qwen3/blob/main/docs/README.md

Starts the documentation server with live reloading. It watches the source directory for changes.

```bash
sphinx-autobuild source build/html
```

--------------------------------

### Environment Setup for HuggingFace Transformers

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/README_zh.md

Installs necessary dependencies for running Qwen2.5 models with HuggingFace Transformers, including PyTorch, AutoGPTQ, and flash-attention.

```shell
conda create -n qwen_perf_transformers python=3.10
conda activate qwen_perf_transformers

pip install torch==2.3.1
pip install git+https://github.com/AutoGPTQ/AutoGPTQ.git@v0.7.1
pip install git+https://github.com/Dao-AILab/flash-attention.git@v2.5.8
pip install -r requirements-perf-transformers.txt
```

--------------------------------

### Install llama.cpp via Homebrew

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

This snippet demonstrates how to install the llama-cli and llama-server using the Homebrew package manager on macOS and Linux. It assumes Homebrew is already installed and provides the command for a straightforward installation.

```shell
brew install llama.cpp
```

--------------------------------

### Environment Setup for vLLM Inference

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/README.md

Sets up a Conda environment for performance testing with vLLM. Installs project-specific requirements.

```shell
conda create -n qwen_perf_vllm python=3.10
conda activate qwen_perf_vllm

pip install -r requirements-perf-vllm.txt
```

--------------------------------

### Run Qwen3 Model with llama-server

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

Starts the llama.cpp HTTP server with the Qwen3 model, enabling REST API access. This command includes parameters for model loading, GPU offloading, and generation settings.

```shell
./llama-server -hf Qwen/Qwen3-8B-GGUF:Q8_0 --jinja --reasoning-format deepseek -ngl 99 -fa -sm row --temp 0.6 --top-k 20 --top-p 0.95 --min-p 0 -c 40960 -n 32768 --no-context-shift
```

--------------------------------

### Interact with Qwen3 Chat Completion API (Disable Thinking)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Demonstrates how to disable the thinking process when interacting with the Qwen3 chat completion API using the `chat_template_kwargs` parameter. This example also shows alternative parameters for temperature and top_p.

```python
from openai import OpenAI

openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

chat_response = client.chat.completions.create(
    model="Qwen/Qwen3-8B",
    messages=[
        {"role": "user", "content": "Give me a short introduction to large language models."},
    ],
    max_tokens=8192,
    temperature=0.7,
    top_p=0.8,
    presence_penalty=1.5,
    extra_body={
        "top_k": 20,
        "chat_template_kwargs": {"enable_thinking": False},
    }
)
print("Chat response:", chat_response)
```

--------------------------------

### Install EvalScope for Performance Testing

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/README.md

Installs the EvalScope library with performance testing dependencies.

```shell
pip install 'evalscope[perf]' -U
```

--------------------------------

### Install Sphinx Autobuild

Source: https://github.com/qwenlm/qwen3/blob/main/docs/README.md

Installs the sphinx-autobuild package, which allows for live reloading of documentation during development.

```bash
pip install sphinx-autobuild
```

--------------------------------

### Initialize OpenAI Client

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/framework/function_call.md

Sets up the OpenAI client to communicate with the vLLM API endpoint. Requires setting the API key and base URL.

```python
from openai import OpenAI

openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

model_name = "Qwen/Qwen3-8B"
```

--------------------------------

### Environment Setup for HuggingFace Transformers

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/README.md

Sets up a Conda environment for performance testing with HuggingFace transformers. Installs PyTorch, AutoGPTQ, FlashAttention, and project-specific requirements.

```shell
conda create -n qwen_perf_transformers python=3.10
conda activate qwen_perf_transformers

pip install torch==2.3.1
pip install git+https://github.com/AutoGPTQ/AutoGPTQ.git@v0.7.1
pip install git+https://github.com/Dao-AILab/flash-attention.git@v2.5.8
pip install -r requirements-perf-transformers.txt
```

--------------------------------

### Compile llama.cpp Locally (macOS/Linux)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

This snippet shows the basic commands to clone the llama.cpp repository, navigate into the directory, and build the project using CMake. It covers the initial setup and the build process, including options for parallel compilation.

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

cmake -B build
cmake --build build --config Release

# Example with parallel compilation (8 jobs)
cmake --build build --config Release -j 8
```

--------------------------------

### Basic AutoGPTQ Quantization Setup

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/quantization/gptq.md

Illustrates the initial setup for quantizing a model using AutoGPTQ. It imports necessary classes and the tokenizer, preparing for the quantization process which typically involves calibration data.

```python
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig
from transformers import AutoTokenizer


```

--------------------------------

### Autobuild Translated Documentation

Source: https://github.com/qwenlm/qwen3/blob/main/docs/README.md

Starts the documentation server with live reloading for a translated version (e.g., zh_CN), watching both source and translation directories.

```bash
sphinx-autobuild source build/html -D language=zh_CN --watch locales/zh_CN
```

--------------------------------

### Start vLLM Server

Source: https://github.com/qwenlm/qwen3/blob/main/eval/README.md

Launches the vLLM inference server to serve the Qwen3 model. This server can then be used by the inference scripts to generate model responses. It supports tensor parallelism for multi-GPU setups.

```bash
export MODEL_NAME="Qwen/Qwen3-235B-A22B-Instruct-2507"  # Replace with desired model
export MODEL_PATH="$MODEL_NAME"  # Or path to local checkpoint
export NUM_GPUS=8

python -m vllm.entrypoints.openai.api_server \
    --model "$MODEL_PATH" \
    --trust-remote-code \
    --served-model-name "$MODEL_NAME" \
    --tensor-parallel-size $NUM_GPUS \
    --enforce-eager \
    --port 8030
```

--------------------------------

### Serve Qwen3 with vLLM

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/framework/function_call.md

Starts a vLLM server for Qwen3 with specific configurations for tool choice and parsing.

```bash
vllm serve Qwen/Qwen3-8B --enable-auto-tool-choice --tool-call-parser hermes --reasoning-parser deepseek_r1
```

--------------------------------

### Install SkyPilot

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/deployment/skypilot.rst

Installs the SkyPilot framework, with optional cloud provider support. It's recommended to use the nightly build for the latest features.

```bash
pip install "skypilot-nightly[aws,gcp]"
```

--------------------------------

### Install Unsloth

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/training/unsloth.md

Installs the Unsloth library locally, recommended for Linux environments. This is the primary step to begin using Unsloth for model training.

```bash
pip install unsloth
```

--------------------------------

### Qwen3-Instruct-2507 Inference with Transformers

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

This snippet demonstrates how to perform inference using the Qwen3-Instruct-2507 model with the Hugging Face Transformers library. It covers loading the model and tokenizer, preparing the input using a chat template, generating text, and decoding the output. It is recommended to use temperature=0.7, top_p=0.8, top_k=20, and min_p=0 for this model.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen3-235B-A22B-Instruct-2507"

# load the tokenizer and the model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)

# prepare the model input
prompt = "Give me a short introduction to large language model."
messages = [
    {"role": "user", "content": prompt}
]
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

# conduct text completion
generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=16384
)
output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist() 

content = tokenizer.decode(output_ids, skip_special_tokens=True)

print("content:", content)
```

--------------------------------

### dstack Admin Token Example

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/deployment/dstack.rst

Shows an example of an admin token that is automatically generated when starting the dstack server. This token is used for authentication when accessing services.

```bash
The admin token is "bbae0f28-d3dd-4820-bf61-8f4bb40815da"
The server is running at http://127.0.0.1:3000/
```

--------------------------------

### Install AutoGPTQ from Source

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/quantization/gptq.md

Provides instructions to clone the AutoGPTQ repository from GitHub and install it in editable mode. This is recommended for using the latest features or contributing to the project.

```bash
git clone https://github.com/AutoGPTQ/AutoGPTQ
cd AutoGPTQ
pip install -e .

```

--------------------------------

### Install Dependencies

Source: https://github.com/qwenlm/qwen3/blob/main/eval/README.md

Installs the necessary Python packages required for running the evaluation scripts. This is a prerequisite step before setting up the inference servers.

```bash
pip install -r requirements.txt
```

--------------------------------

### Required Python Packages

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/requirements-perf-transformers.txt

Lists the core Python packages and their specific versions required for the Qwen3 project. These packages provide the foundational libraries for model loading, inference, and optimization.

```python
torch==2.3.1
transformers==4.46.0
autoawq==0.2.6
modelscope[framework]
accelerate
optimum>=1.20.0
```

--------------------------------

### Basic Text Generation with Transformers Pipeline

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/inference/transformers.md

Demonstrates how to use the `pipeline` function from the Transformers library to generate text with the Qwen3 model. It shows a multi-turn conversation example and highlights key parameters for initializing the pipeline.

```python
from transformers import pipeline

model_name_or_path = "Qwen/Qwen3-8B"

generator = pipeline(
    "text-generation", 
    model_name_or_path,
    torch_dtype="auto", 
    device_map="auto",
)

messages = [
    {"role": "user", "content": "Give me a short introduction to large language models."},
]
messages = generator(messages, max_new_tokens=32768)[0]["generated_text"]
# print(messages[-1]["content"])

messages.append({"role": "user", "content": "In a single sentence."})
messages = generator(messages, max_new_tokens=32768)[0]["generated_text"]
# print(messages[-1]["content"])

```

--------------------------------

### Install EvalScope for Performance Benchmarking

Source: https://github.com/qwenlm/qwen3/blob/main/examples/speed-benchmark/README_zh.md

Installs the EvalScope library with performance testing capabilities, used for benchmarking Qwen2.5 models.

```shell
pip install 'evalscope[perf]' -U
```

--------------------------------

### Resolve CUDA Extension Not Installed Error with AutoGPTQ

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/quantization/gptq.md

This section addresses the 'CUDA extension not installed' error when using AutoGPTQ with Qwen models, which leads to slow inference. It suggests following the AutoGPTQ installation guide to install a pre-built wheel or build from source.

```text
Follow its [installation guide](https://github.com/AutoGPTQ/AutoGPTQ/blob/main/docs/INSTALLATION.md) to install a pre-built wheel or try installing `auto_gptq` from source.
```

--------------------------------

### Create Chat Completion (No Think Mode)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/framework/function_call.md

Example of calling the chat completions endpoint to get a response from the model, with tool calls enabled and thinking disabled.

```python
response = client.chat.completions.create(
    model=model_name,
    messages=messages,
    tools=tools,
    temperature=0.7,
    top_p=0.8,
    max_tokens=512,
    extra_body={
        "repetition_penalty": 1.05,
        "chat_template_kwargs": {"enable_thinking": False}  # default to True
    },
)
```

--------------------------------

### Download GGUF Model with huggingface-cli

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

This snippet demonstrates how to download a specific GGUF model file from the Hugging Face Hub using the `huggingface-cli` tool. It requires the model repository name and the desired GGUF filename, specifying a local directory for the download. Ensure `huggingface_hub` is installed (`pip install huggingface_hub`).

```bash
huggingface-cli download <model_repo> <gguf_file> --local-dir <local_dir>
```

```bash
huggingface-cli download Qwen/Qwen3-8B-GGUF qwen3-8b-q4_k_m.gguf --local-dir .
```

--------------------------------

### Install SGLang

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/deployment/sglang.md

Installs the SGLang library with all dependencies using pip. Ensure you are in a clean Python environment before installation.

```shell
pip install "sglang[all]>=0.4.6.post1"
```

--------------------------------

### llama.cpp API Documentation

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

Provides an overview of the REST API endpoints offered by `llama-server`, including the base URL, OpenAI compatible endpoint, and web UI access.

```APIDOC
llama-server API Endpoints:

Base URL: http://localhost:8080

OpenAI Compatible API: http://localhost:8080/v1/

Web UI: http://localhost:8080/

Key Features:
- Supports LLM REST APIs.
- Includes a simple web front end for interaction.
- Capable of thinking content parsing and tool call parsing.
```

--------------------------------

### Configure Smaller Model Training

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/training/axolotl.md

Example YAML configuration snippet to specify a smaller base model for training. This allows users to adapt the training process for different model sizes.

```yaml
base_model: Qwen/Qwen3-8B
```

--------------------------------

### Qwen-Agent Function Calling Example

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/framework/function_call.md

Demonstrates how to use function calling with Qwen-Agent, a framework that simplifies LLM interactions. This example would typically involve defining tools and then using the agent to call them based on user queries.

```python
# Example of Qwen-Agent function calling setup (conceptual)
from qwen_agent import QwenAgent

# Define tools (functions) that the agent can use
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    }
]

# Initialize the agent with a model and tools
agent = QwenAgent(model="qwen3-chat", tools=tools)

# Example of a user query that might trigger function calling
user_query = "What's the weather like in London?"

# The agent would process the query, potentially calling the 'get_weather' tool
# response = agent.chat(user_query)
# print(response)

```

--------------------------------

### SGLang Environment Setup

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/speed_benchmark.md

Details the software stack for running Qwen3 models with SGLang. It includes PyTorch, Transformers, SGLang, SGL-kernel, and vLLM (for AWQ quantization).

```python
# Software:
# PyTorch 2.6.0+cu124
# Transformers 4.51.3
# SGLang 0.4.6.post1
# SGL-kernel 0.1.0
# vLLM 0.7.2 (Required by SGLang for AWQ quantization)
```

--------------------------------

### Install MS-SWIFT and Dependencies

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/training/ms_swift.md

Installs the ms-swift package and essential dependencies like transformers. Optional packages for multi-GPU training, memory saving, and optimized attention are also provided.

```shell
pip install ms-swift -U
# Install from source
pip install git+https://github.com/modelscope/ms-swift.git

pip install transformers -U

# Optional packages
pip install deepspeed # multi-GPU training
pip install liger-kernel # save GPU memory resources
pip install flash-attn --no-build-isolation
```

--------------------------------

### Running llama.cpp with Qwen3 Models

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/run_locally/llama.cpp.md

Outlines the three main steps to run Qwen3 models using llama.cpp: obtaining the necessary programs (like llama-cli and llama-server), acquiring Qwen3 models in GGUF format, and executing the program with the specified model.

```bash
# Step 1: Get the programs (e.g., llama-cli, llama-server)
# git clone https://github.com/ggml-org/llama.cpp
# cd llama.cpp
# make

# Step 2: Get Qwen3 models in GGUF format
# Download model files from a trusted source (e.g., Hugging Face)

# Step 3: Run the program with the model
# ./main -m /path/to/your/qwen3.gguf -p "Your prompt here"
```

--------------------------------

### Interact with Qwen3 Chat Completion API (Disable Thinking - curl)

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/getting_started/quickstart.md

Provides a curl command to interact with the Qwen3 chat completion API, specifically disabling the thinking process. It includes parameters for disabling thinking and alternative settings for temperature and top_p.

```shell
curl http://localhost:8000/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Qwen/Qwen3-8B",
  "messages": [
    {"role": "user", "content": "Give me a short introduction to large language models."}
  ],
  "temperature": 0.7,
  "top_p": 0.8,
  "top_k": 20,
  "max_tokens": 8192,
  "presence_penalty": 1.5,
  "chat_template_kwargs": {"enable_thinking": false}
}'
```

--------------------------------

### Axolotl Dataset Configuration

Source: https://github.com/qwenlm/qwen3/blob/main/docs/source/training/axolotl.md

Example YAML snippet for configuring the dataset path and type in Axolotl. It specifies a local JSON file and uses the 'chat_template' type for processing.

```yaml
datasets:
  - path: path/to/your/dataset.json
    type: chat_template
```