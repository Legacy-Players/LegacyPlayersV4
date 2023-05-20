FROM rust:1.69

RUN rustup install nightly-2023-01-22
RUN rustup default nightly-2023-01-22
RUN rustup target add wasm32-unknown-unknown

RUN mkdir /Backend
COPY ./src /Backend/src
COPY ./sub_crates /Backend/sub_crates
COPY ./Cargo.toml /Backend/Cargo.toml

WORKDIR /Backend

RUN cargo update
RUN cargo build --release

ENTRYPOINT ["/bin/bash", "-c", "sleep 5s && /Backend/target/release/backend"]


