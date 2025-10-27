### DeepSeek-Infer Demo: Install Requirements

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Navigates to the inference directory of the cloned repository and installs all required Python dependencies listed in the 'requirements.txt' file.

```shell
cd DeepSeek-V3/inference
pip install -r requirements.txt
```

--------------------------------

### DeepSeek-Infer Demo: Install Dependencies

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Installs the necessary Python packages for the DeepSeek-Infer Demo, including PyTorch, Triton, Transformers, and Safetensors. It's recommended to use a virtual environment for installation.

```pip-requirements
torch==2.4.1
triton==3.0.0
transformers==4.46.3
safetensors==0.4.5
```

--------------------------------

### DeepSeek-Infer Demo: Run Interactive Chat

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Launches the DeepSeek-Infer Demo for interactive chat. This command requires specifying the checkpoint path, configuration file, and parameters like temperature and maximum new tokens. It utilizes torchrun for distributed execution.

```shell
torchrun --nnodes 2 --nproc-per-node 8 --node-rank $RANK --master-addr $ADDR generate.py --ckpt-path /path/to/DeepSeek-V3-Demo --config configs/config_671B.json --interactive --temperature 0.7 --max-new-tokens 200
```

--------------------------------

### DeepSeek-V3 Weight Loading Logic

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README_WEIGHTS.md

This Python-like pseudocode describes the logic for loading DeepSeek-V3 weights, differentiating between main model weights and MTP modules based on configuration parameters.

```python
# Main Model Weights are loaded via num_hidden_layers
# MTP Modules are loaded via num_nextn_predict_layers, with layer IDs appended
# Example: if num_hidden_layers = 61 and num_nextn_predict_layers = 1,
# the MTP Module's layer ID is 61.
```

--------------------------------

### DeepSeek-Infer Demo: Run Batch Inference

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Executes batch inference using the DeepSeek-Infer Demo on a given input file. Similar to interactive chat, it requires specifying the checkpoint path and configuration file, and uses torchrun for distributed execution.

```shell
torchrun --nnodes 2 --nproc-per-node 8 --node-rank $RANK --master-addr $ADDR generate.py --ckpt-path /path/to/DeepSeek-V3-Demo --config configs/config_671B.json --input-file $FILE
```

--------------------------------

### DeepSeek-Infer Demo: Clone Repository

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Clones the official DeepSeek-V3 GitHub repository to your local machine, which contains the model code and inference scripts.

```shell
git clone https://github.com/deepseek-ai/DeepSeek-V3.git
```

--------------------------------

### DeepSeek-V3 Model Downloads

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Provides download links and key specifications for the DeepSeek-V3 models, including total parameters, activated parameters, and context length. It also notes the total size on Hugging Face, which includes main model weights and MTP module weights.

```APIDOC
Model Specifications:

DeepSeek-V3-Base:
  Total Parameters: 671B
  Activated Parameters: 37B
  Context Length: 128K
  Download: [🤗 Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3-Base)

DeepSeek-V3:
  Total Parameters: 671B
  Activated Parameters: 37B
  Context Length: 128K
  Download: [🤗 Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3)

Note:
  The total size of DeepSeek-V3 models on Hugging Face is 685B, comprising 671B for the Main Model weights and 14B for the Multi-Token Prediction (MTP) Module weights.
  MTP support is under active development.
```

--------------------------------

### DeepSeek-Infer Demo: Convert Model Weights

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Converts Hugging Face model weights to a format suitable for the DeepSeek-Infer Demo. This involves specifying the input Hugging Face checkpoint path and the desired output save path, along with model parallel and expert configurations.

```shell
python convert.py --hf-ckpt-path /path/to/DeepSeek-V3 --save-path /path/to/DeepSeek-V3-Demo --n-experts 256 --model-parallel 16
```

--------------------------------

### MindIE Inference for Huawei Ascend NPUs

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This section details the adaptation of the BF16 version of DeepSeek-V3 by the MindIE framework for Huawei Ascend NPUs. It provides a link to specific instructions for Ascend NPU users.

```APIDOC
MindIE Inference for Ascend NPUs:
  Framework: MindIE
  Model Support: DeepSeek-V3 (BF16 version)
  Hardware Support: Huawei Ascend NPUs
  Instructions: https://modelers.cn/models/MindIE/deepseekv3
  Notes: Framework from Huawei Ascend community adapted the model for their NPUs.
```

--------------------------------

### DeepSeek-V3 FP8 Dequantization Formula

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README_WEIGHTS.md

This documentation outlines the dequantization process for FP8 weights in DeepSeek-V3. It includes the formula used and considerations for zero-padding.

```APIDOC
Dequantization Method:
  The FP8 weight file includes a `weight_scale_inv` field, which stores the dequantization scale for each weight block.
  - Storage Format: `float32 Tensor`, stored alongside the weight data.
  - Dequantization Formula:
    - If the weight block is not aligned to 128, it is zero-padded to 128 before calculating the scale. After quantization, the padded portion is removed.
    - The dequantization process is performed as: `(128x128 weight block) * weight_scale_inv`.

Runtime Operations:
  Through dequantization of the FP8 weights, runtime operations enable online quantization at a granularity of `per-token-per-128-channel`.
```

--------------------------------

### DeepSeek-V3 FP8 Quantization Configuration

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README_WEIGHTS.md

This JSON snippet illustrates the `quantization_config` field used in DeepSeek-V3 for FP8 quantization. It specifies the activation scheme, format, quantization method, and weight block size.

```json
{
  "quantization_config": {
    "activation_scheme": "dynamic",
    "fmt": "e4m3",
    "quant_method": "fp8",
    "weight_block_size": [128, 128]
  }
}
```

--------------------------------

### Standard Benchmarks (Models larger than 67B)

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Presents a comparative analysis of DeepSeek V2 and V3 models against other leading LLMs on various English, Code, Math, and Chinese benchmarks. It includes metrics like MMLU, DROP, HumanEval, MATH, and C-Eval, showcasing model performance based on activated and total parameters.

```APIDOC
Benchmark Comparison:

Models Evaluated:
- DeepSeek V2-0506 (MoE, 21B Activated, 236B Total)
- DeepSeek V2.5-0905 (MoE, 21B Activated, 236B Total)
- Qwen2.5 72B-Inst. (Dense, 72B Total)
- Llama3.1 405B-Inst. (Dense, 405B Total)
- Claude-3.5-Sonnet-1022
- GPT-4o 0513
- DeepSeek V3 (MoE, 37B Activated, 671B Total)

Benchmark Categories:
- English (MMLU, MMLU-Redux, MMLU-Pro, DROP, IF-Eval, GPQA-Diamond, SimpleQA, FRAMES, LongBench v2)
- Code (HumanEval-Mul, LiveCodeBench, Codeforces, SWE Verified, Aider-Edit, Aider-Polyglot)
- Math (AIME 2024, MATH-500, CNMO 2024)
- Chinese (CLUEWSC, C-Eval, C-SimpleQA)

Evaluation Notes:
- Output length limited to 8K.
- Benchmarks with <1000 samples are tested multiple times with varying temperatures for robust results.
- DeepSeek-V3 is highlighted as the best-performing open-source model and competitive with closed-source models.
```

--------------------------------

### LMDeploy Inference Recommendations

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

LMDeploy is recommended for DeepSeek-V3 inference, providing a flexible framework for both offline processing and online serving. It integrates well with PyTorch workflows and supports efficient inference.

```APIDOC
LMDeploy:
  Description: A flexible and high-performance inference and serving framework for large language models.
  Features:
    - Offline pipeline processing
    - Online deployment capabilities
    - Seamless PyTorch integration
  Model Support:
    - DeepSeek-V3
  Usage:
    For comprehensive step-by-step instructions, please refer to: https://github.com/InternLM/lmdeploy/issues/2960
```

--------------------------------

### Convert FP8 Weights to BF16

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This script converts FP8 model weights to BF16 format, which is necessary if BF16 weights are required for experimentation as only FP8 training is natively supported.

```shell
cd inference
python fp8_cast_bf16.py --input-fp8-hf-path /path/to/fp8_weights --output-bf16-hf-path /path/to/bf16_weights
```

--------------------------------

### vLLM Inference for DeepSeek-V3

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This section details inference with vLLM, supporting DeepSeek-V3 on both NVIDIA and AMD GPUs with FP8 and BF16 modes. It mentions vLLM's pipeline parallelism for multi-machine deployment and directs users to vLLM's documentation for further guidance.

```APIDOC
vLLM Inference:
  Framework: vLLM (v0.6.6+)
  Model Support: DeepSeek-V3
  Precisions: FP8, BF16
  Hardware Support: NVIDIA GPUs, AMD GPUs
  Features: Pipeline parallelism for distributed serving
  Documentation: https://docs.vllm.ai/en/latest/serving/distributed_serving.html
  Enhancement Plan: https://github.com/vllm-project/vllm/issues/11539
  Notes: Recommended for inference, supports advanced deployment strategies.
```

--------------------------------

### DeepSeek AI Platform API Access

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Provides information on accessing DeepSeek models through an OpenAI-Compatible API. Users can integrate DeepSeek's advanced language models into their applications via this platform.

```APIDOC
DeepSeek Platform API:

Description: Offers an OpenAI-Compatible API for accessing DeepSeek language models.

Access Point:
- Website: https://platform.deepseek.com/

Features:
- OpenAI-compatible interface, allowing for easy integration with existing tools and workflows designed for OpenAI APIs.
- Access to various DeepSeek models, including potentially DeepSeek V3 and earlier versions.
```

--------------------------------

### DeepSeek-V3 Benchmark Performance

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This table summarizes the performance of DeepSeek-V3 against other models on various benchmarks. It includes metrics like Accuracy (Acc.), Exact Match (EM), and Pass@1, across different task categories such as English, Code, Math, Chinese, and Multilingual. Best results are indicated in bold.

```APIDOC
Benchmark Performance Table:

| Category | Benchmark (Metric) | # Shots | DeepSeek-V2 | Qwen2.5 72B | LLaMA3.1 405B | DeepSeek-V3 |
|---|---|---|---|---|---|---|
| Architecture | - | - | MoE | Dense | Dense | MoE |
| # Activated Params | - | - | 21B | 72B | 405B | 37B |
| # Total Params | - | - | 236B | 72B | 405B | 671B |
| English | Pile-test (BPB) | - | 0.606 | 0.638 | **0.542** | 0.548 |
| | BBH (EM) | 3-shot | 78.8 | 79.8 | 82.9 | **87.5** |
| | MMLU (Acc.) | 5-shot | 78.4 | 85.0 | 84.4 | **87.1** |
| | MMLU-Redux (Acc.) | 5-shot | 75.6 | 83.2 | 81.3 | **86.2** |
| | MMLU-Pro (Acc.) | 5-shot | 51.4 | 58.3 | 52.8 | **64.4** |
| | DROP (F1) | 3-shot | 80.4 | 80.6 | 86.0 | **89.0** |
| | ARC-Easy (Acc.) | 25-shot | 97.6 | 98.4 | 98.4 | **98.9** |
| | ARC-Challenge (Acc.) | 25-shot | 92.2 | 94.5 | **95.3** | **95.3** |
| | HellaSwag (Acc.) | 10-shot | 87.1 | 84.8 | **89.2** | 88.9 |
| | PIQA (Acc.) | 0-shot | 83.9 | 82.6 | **85.9** | 84.7 |
| | WinoGrande (Acc.) | 5-shot | **86.3** | 82.3 | 85.2 | 84.9 |
| | RACE-Middle (Acc.) | 5-shot | 73.1 | 68.1 | **74.2** | 67.1 |
| | RACE-High (Acc.) | 5-shot | 52.6 | 50.3 | **56.8** | 51.3 |
| | TriviaQA (EM) | 5-shot | 80.0 | 71.9 | 82.7 | **82.9** |
| | NaturalQuestions (EM) | 5-shot | 38.6 | 33.2 | **41.5** | 40.0 |
| | AGIEval (Acc.) | 0-shot | 57.5 | 75.8 | 60.6 | **79.6** |
| Code | HumanEval (Pass@1) | 0-shot | 43.3 | 53.0 | 54.9 | **65.2** |
| | MBPP (Pass@1) | 3-shot | 65.0 | 72.6 | 68.4 | **75.4** |
| | LiveCodeBench-Base (Pass@1) | 3-shot | 11.6 | 12.9 | 15.5 | **19.4** |
| | CRUXEval-I (Acc.) | 2-shot | 52.5 | 59.1 | 58.5 | **67.3** |
| | CRUXEval-O (Acc.) | 2-shot | 49.8 | 59.9 | 59.9 | **69.8** |
| Math | GSM8K (EM) | 8-shot | 81.6 | 88.3 | 83.5 | **89.3** |
| | MATH (EM) | 4-shot | 43.4 | 54.4 | 49.0 | **61.6** |
| | MGSM (EM) | 8-shot | 63.6 | 76.2 | 69.9 | **79.8** |
| | CMath (EM) | 3-shot | 78.7 | 84.5 | 77.3 | **90.7** |
| Chinese | CLUEWSC (EM) | 5-shot | 82.0 | 82.5 | **83.0** | 82.7 |
| | C-Eval (Acc.) | 5-shot | 81.4 | 89.2 | 72.5 | **90.1** |
| | CMMLU (Acc.) | 5-shot | 84.0 | **89.5** | 73.7 | 88.8 |
| | CMRC (EM) | 1-shot | **77.4** | 75.8 | 76.0 | 76.3 |
| | C3 (Acc.) | 0-shot | 77.4 | 76.7 | **79.7** | 78.6 |
| | CCPM (Acc.) | 0-shot | **93.0** | 88.5 | 78.6 | 92.0 |
| Multilingual | MMMLU-non-English (Acc.) | 5-shot | 64.0 | 74.8 | 73.8 | **79.4** |

Note: Best results are shown in bold. Scores with a gap not exceeding 0.3 are considered to be at the same level.
```

--------------------------------

### LightLLM Inference for DeepSeek-V3

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This section covers inference using LightLLM, which supports DeepSeek-R1 (FP8/BF16) and DeepSeek-V3. It highlights single-machine and multi-machine tensor parallel deployment, mixed-precision, and ongoing integration of quantization modes. PD-disaggregation for DeepSeek-V3 is under development.

```APIDOC
LightLLM Inference:
  Framework: LightLLM (v1.0.1+)
  Model Support: DeepSeek-R1 (FP8/BF16), DeepSeek-V3
  Deployment: Single-machine, Multi-machine tensor parallel
  Precisions: FP8, BF16, Mixed-precision
  Features: Continuous integration of quantization modes, PD-disaggregation (in development for V3)
  Documentation: https://lightllm-en.readthedocs.io/en/latest/getting_started/quickstart.html
  Notes: Recommended for inference, offers flexible deployment options.
```

--------------------------------

### SGLang Inference Recommendations

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

SGLang is recommended for DeepSeek-V3 inference due to its optimizations like MLA, DP Attention, FP8 KV Cache, and Torch Compile, offering high performance on both NVIDIA and AMD GPUs. It also supports multi-node tensor parallelism.

```APIDOC
SGLang:
  Description: A high-performance inference framework supporting DeepSeek-V3 with advanced optimizations.
  Features:
    - MLA optimizations
    - DP Attention
    - FP8 KV Cache
    - Torch Compile
    - Multi-node tensor parallelism
  Hardware Support:
    - NVIDIA GPUs
    - AMD GPUs
  Version Support:
    - v0.4.1 and later recommended
  Usage:
    Refer to the official SGLang benchmark for DeepSeek-V3 for detailed launch instructions: https://github.com/sgl-project/sglang/tree/main/benchmark/deepseek_v3
```

--------------------------------

### DeepSeek-V3 Context Window Evaluation (NIAH)

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This section presents the evaluation results of DeepSeek-V3 on the Needle In A Haystack (NIAH) tests, demonstrating its performance across various context window lengths up to 128K.

```APIDOC
Context Window Evaluation:

Image: figures/niah.png

Description: Evaluation results on the "Needle In A Haystack" (NIAH) tests. DeepSeek-V3 performs well across all context window lengths up to 128K.
```

--------------------------------

### SGLang Inference for AMD GPUs

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This section describes the Day-One support for AMD GPUs using SGLang for DeepSeek-V3 inference. It confirms full compatibility with FP8 and BF16 precision and refers to SGLang instructions for detailed guidance.

```APIDOC
SGLang Inference for AMD GPUs:
  Framework: SGLang
  Model Support: DeepSeek-V3
  Hardware Support: AMD GPUs
  Precisions: FP8, BF16
  Notes: Achieved Day-One support, recommended for AMD GPU users. Refer to SGLang instructions for details.
```

--------------------------------

### DeepSeek-V3 Project Dependencies

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/inference/requirements.txt

Specifies the Python package versions required for the DeepSeek-V3 project. These include deep learning frameworks, model implementations, and utility libraries.

```python
torch==2.4.1
triton==3.0.0
transformers==4.46.3
safetensors==0.4.5
```

--------------------------------

### DeepSeek-V3 Citation

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This entry provides the BibTeX citation for the DeepSeek-V3 technical report, which should be used when referencing the model in academic or research contexts.

```BibTeX
@misc{deepseekai2024deepseekv3technicalreport,
      title={DeepSeek-V3 Technical Report},
      author={DeepSeek-AI},
      year={2024},
      eprint={2412.19437},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2412.19437},
}

```

--------------------------------

### Open Ended Generation Evaluation

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

Evaluates DeepSeek models on open-ended conversation tasks using Arena-Hard and AlpacaEval 2.0 metrics. This section compares DeepSeek V2.5 and V3 against other prominent models, focusing on their conversational capabilities and win rates.

```APIDOC
Open Ended Generation Evaluation:

Metrics:
- Arena-Hard
- AlpacaEval 2.0 (Length-controlled win rate)

Models Evaluated:
- DeepSeek-V2.5-0905
- Qwen2.5-72B-Instruct
- LLaMA-3.1 405B
- GPT-4o-0513
- Claude-Sonnet-3.5-1022
- DeepSeek-V3

Evaluation Notes:
- Focuses on English open-ended conversation.
- DeepSeek-V3 shows strong performance in both Arena-Hard and AlpacaEval 2.0.
```

--------------------------------

### TRT-LLM Inference for DeepSeek-V3

Source: https://github.com/deepseek-ai/deepseek-v3/blob/main/README.md

This section describes how to use TensorRT-LLM for DeepSeek-V3 inference. It highlights support for BF16 and INT4/INT8 weight-only precisions, with FP8 support in progress. Users can access a custom branch of TRT-LLM for DeepSeek-V3 specific features.

```APIDOC
TensorRT-LLM Inference:
  Framework: TensorRT-LLM
  Model Support: DeepSeek-V3
  Precisions: BF16, INT4/INT8 (weight-only), FP8 (in progress)
  Repository: https://github.com/NVIDIA/TensorRT-LLM
  DeepSeek-V3 Branch: https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/deepseek_v3
  Notes: Offers precision options and is recommended for inference.
```