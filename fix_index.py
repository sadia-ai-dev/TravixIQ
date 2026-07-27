with open("index.html", "r") as f:
    content = f.read()

content = content.replace("<title>My Google AI Studio App</title>", "<title>TravixIQ - Travel Smarter. Explore Better.</title>")

with open("index.html", "w") as f:
    f.write(content)
