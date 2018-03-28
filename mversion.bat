@echo off
for %%i in (%*) do richtool egretVersion %%i %~dp0
pause
