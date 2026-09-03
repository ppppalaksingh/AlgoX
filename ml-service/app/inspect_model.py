import os
import torch
from safetensors import safe_open

model_path = os.path.abspath("ml-service/app/models/custom_stats_embedder/model.safetensors")

if os.path.exists(model_path):
    with safe_open(model_path, framework="pt", device="cpu") as f:
        keys = f.keys()
        print(f"=== MODEL.SAFETENSORS INSPECTION ===")
        print(f"Total Tensor Layers: {len(keys)}")
        total_params = 0
        for i, k in enumerate(keys):
            tensor = f.get_tensor(k)
            numel = tensor.numel()
            total_params += numel
            if i < 12 or i > len(keys) - 4:
                print(f"Layer {i+1:02d}: {k:<45} | Shape: {str(list(tensor.shape)):<18} | Params: {numel:,}")
            elif i == 12:
                print("... [Intermediate Transformer Encoder Layers 2-5] ...")
        print(f"Total Parameters: {total_params:,} (~{total_params/1e6:.1f} Million parameters)")
else:
    print("File not found at:", model_path)
