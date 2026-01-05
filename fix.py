with open('app/api/chat-rooms/route.ts', 'r') as f:
    content = f.read()

content = content.replace('[...new Set([session.user.id, ...memberIds])]', 'Array.from(new Set([session.user.id, ...memberIds]))')

with open('app/api/chat-rooms/route.ts', 'w') as f:
    f.write(content)

print('Fixed')

