import re
with open("src/components/TravelPlanner.tsx", "r") as f:
    content = f.read()

# Replace using string replace just in case of formatting
chunk = """                  {/* Daily Route Map */}
                  <div className="pt-2 pb-4">
                    <MapRoute dayPlan={(activeTrip.itinerary || []).find((d: DailyPlan) => d.dayNumber === selectedDay) || null} />
                  </div>"""

if chunk in content:
    content = content.replace(chunk, "")
else:
    # try regex again with DOTALL
    content = re.sub(r"\s*\{\/\* Daily Route Map \*\/\}\s*<div className=\"pt-2 pb-4\">\s*<MapRoute[^>]*/>\s*</div>", "", content, flags=re.DOTALL)

with open("src/components/TravelPlanner.tsx", "w") as f:
    f.write(content)
