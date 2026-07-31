FROM openjdk:21-slim

WORKDIR /sandbox

RUN useradd -m -s /bin/bash sandboxuser
RUN chown -R sandboxuser:sandboxuser /sandbox

USER sandboxuser

# Similar to C++, script will compile and run Main.java
COPY run.sh /sandbox/run.sh
CMD ["/bin/bash", "/sandbox/run.sh"]
