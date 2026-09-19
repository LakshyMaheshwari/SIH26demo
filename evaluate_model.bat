@echo off
SET PY="C:\Users\Piyush\AppData\Local\Programs\Python\Python312\python.exe"
echo ============================================================
echo  RetinaScan-XAI — Evaluating Model (Sensitivity/Specificity)
echo ============================================================
%PY% ml_script\evaluate_model.py
pause
