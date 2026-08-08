import os
import re

file_path = "frontend/src/pages/ProblemDetail.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the Results Panel block from its current location
# The block starts at `        {/* Results Panel overlay */}`
# and ends right before `        {/* Controls Bar (Moved to Bottom) */}`

start_marker = "        {/* Results Panel overlay */}"
end_marker = "        {/* Controls Bar (Moved to Bottom) */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

results_panel = content[start_idx:end_idx]

# Modify the classes of the Results Panel to fit the new layout
# Replace absolute positioning with a standard flex layout
old_class = 'className="absolute bottom-[96px] left-3 right-3 bg-gray-950/98 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl shadow-black/90 z-20 max-h-[500px] h-[50vh] overflow-y-auto flex flex-col"'
new_class = 'className="w-full bg-gray-950/98 border-t border-gray-800 shadow-inner h-[500px] overflow-y-auto flex flex-col z-20 mt-auto"'

results_panel_modified = results_panel.replace(old_class, new_class)

# 2. Delete it from the old position
content_without_panel = content[:start_idx] + content[end_idx:]

# 3. Find the end of Controls Bar
# Controls bar ends with:
#               {submitting ? 'Submitting...' : 'Submit'}
#             </button>
#           </div>
#         </div>

controls_bar_end_marker = """            </button>
          </div>
        </div>"""

insert_idx = content_without_panel.find(controls_bar_end_marker) + len(controls_bar_end_marker)

# Insert the Results Panel after the Controls Bar
final_content = content_without_panel[:insert_idx] + "\n\n" + results_panel_modified.strip('\n') + "\n" + content_without_panel[insert_idx:]

# 4. Modify Code Editor Panel classes
old_editor_class = 'className="relative z-10 w-full lg:w-1/2 flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-md glass-panel shadow-2xl rounded-2xl overflow-hidden h-[85vh] min-h-[600px]"'
new_editor_class = 'className="relative z-10 w-full lg:w-1/2 flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-md glass-panel shadow-2xl rounded-2xl overflow-hidden min-h-[600px] h-fit"'
final_content = final_content.replace(old_editor_class, new_editor_class)

# 5. Modify Editor Container classes
old_container_class = 'className="flex-1 min-h-[200px] relative"'
new_container_class = 'className="flex-1 min-h-[500px] relative"'
final_content = final_content.replace(old_container_class, new_container_class)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Moved Results Panel below Controls Bar successfully!")
