import base64, subprocess, os

p = base64.b64decode("UTNoMnQqV0tOUipBYyEm").decode("utf-8")
r = subprocess.run(["rclone", "obscure", p], capture_output=True, text=True)
obscured = r.stdout.strip()
print("Obscured:", obscured)

conf_path = os.path.expanduser("~/.config/rclone/rclone.conf")
with open(conf_path, "r") as f:
    lines = f.readlines()

in_storagebox = False
new_lines = []
for line in lines:
    if line.strip() == "[storagebox]":
        in_storagebox = True
    elif line.startswith("["):
        in_storagebox = False
    if in_storagebox and line.strip().startswith("pass"):
        line = "pass = " + obscured + "\n"
    new_lines.append(line)

with open(conf_path, "w") as f:
    f.writelines(new_lines)
print("Config updated successfully")
