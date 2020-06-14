FROM debian:10.2

ENV MODEL_VERSION 0.2
ENV SMALL_MODEL_VERSION 0.3

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        g++ \
        gfortran \
        bzip2 \
        unzip \
        make \
        wget \
        git \
        python3 \
        python3-dev \
        python3-websockets \
        python3-setuptools \
        zlib1g-dev \
        patch \
        ca-certificates \
        swig \
        cmake \
    && rm -rf /var/lib/apt/lists/*

RUN \
    git clone -b lookahead --single-branch https://github.com/alphacep/kaldi /opt/kaldi \
    && cd /opt/kaldi/tools \
    && sed -i 's:status=0:exit 0:g' extras/check_dependencies.sh \
    && sed -i 's:openfst_add_CXXFLAGS = -g -O2:openfst_add_CXXFLAGS = -g -O3 -msse2 -msse4 -mavx:g' Makefile \
    && sed -i 's:--enable-ngram-fsts:--enable-ngram-fsts --disable-bin:g' Makefile \
    && sed -i 's:python:python3:g' extras/install_openblas.sh \
    && sed -i 's:USE_LOCKING=1:TARGET=SANDYBRIDGE USE_LOCKING=1:g' extras/install_openblas.sh \
    && make -j $(nproc) openfst cub \
    && extras/install_openblas.sh \
    && cd /opt/kaldi/src \
    && ./configure --mathlib=OPENBLAS --shared \
    && sed -i 's:-msse -msse2:-msse -msse2 -msse4 -mavx:g' kaldi.mk \
    && sed -i 's: -O1 : -O3 :g' kaldi.mk \
    && make -j $(nproc) online2 lm

RUN \
    git clone https://github.com/alphacep/vosk-api /opt/vosk-api \
    && sed -i 's:--max-active=3000:--max-active=7000:g' /opt/vosk-api/src/model.cc \
    && sed -i 's:--beam=10.0:--beam=13.0:g' /opt/vosk-api/src/model.cc \
    && sed -i 's:--lattice-beam=2.0:--lattice-beam=6.0:g' /opt/vosk-api/src/model.cc \
    && cd /opt/vosk-api/python \
    && KALDI_ROOT=/opt/kaldi python3 ./setup.py install --user --single-version-externally-managed --root=/ \
    && rm -rf /opt/kaldi

RUN mkdir /opt/vosk-model-en \
   && cd /opt/vosk-model-en \
   && wget -q http://alphacephei.com/kaldi/models/vosk-model-en-us-aspire-${MODEL_VERSION}.zip \
   && unzip vosk-model-en-us-aspire-${MODEL_VERSION}.zip \
   && mv vosk-model-en-us-aspire-${MODEL_VERSION} model \
   && rm -rf vosk-model-en-us-aspire-${MODEL_VERSION}.zip

RUN mkdir /opt/vosk-small-model-en \
   && cd /opt/vosk-small-model-en \
   && wget -q http://alphacephei.com/kaldi/models/vosk-model-small-en-us-${SMALL_MODEL_VERSION}.zip \
   && unzip vosk-model-small-en-us-${SMALL_MODEL_VERSION}.zip \
   && mv vosk-model-small-en-us-${SMALL_MODEL_VERSION} model \
   && rm -rf vosk-model-small-en-us-${SMALL_MODEL_VERSION}.zip

RUN echo '3' > /dev/null && git clone https://github.com/Pierca7/fictional-umbrella /opt/vosk-server

EXPOSE 2700
WORKDIR /opt/vosk-server/src/voice-server
CMD [ "python3", "./websocket_server.py", "/opt/vosk-model-en/model", "/opt/vosk-small-model-en/model" ]
