FROM node:20-slim

WORKDIR /sandbox

RUN useradd -m -s /bin/bash sandboxuser
RUN chown -R sandboxuser:sandboxuser /sandbox

USER sandboxuser

CMD ["node", "-"]
