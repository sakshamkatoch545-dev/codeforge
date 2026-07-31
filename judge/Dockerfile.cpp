FROM gcc:13

WORKDIR /sandbox

RUN useradd -m -s /bin/bash sandboxuser
RUN chown -R sandboxuser:sandboxuser /sandbox

USER sandboxuser

# For C++, the host will mount the source file, compile it, and run the binary
# A wrapper script can handle this
COPY run.sh /sandbox/run.sh
CMD ["/bin/bash", "/sandbox/run.sh"]
