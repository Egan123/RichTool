@echo off
for %%i in (%*) do richtool v2index %%i %~dp0
pause
