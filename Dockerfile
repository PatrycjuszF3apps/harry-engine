# Dockerfile – Ubuntu 24.04 – Node.js Game Dev Environment
FROM ubuntu:24.04

# Arguments from .env
ARG UID=1000
ARG GID=1000

SHELL ["/bin/bash", "-c"]

# 1. CHANGE: Set TERM to xterm-256color to force color support in terminal
ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 LC_ALL=C.UTF-8 \
    TERM=xterm-256color

# Basic system tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gnupg2 curl wget ca-certificates \
        build-essential git mc nano \
        && rm -rf /var/lib/apt/lists/*

# Install Node.js 22.x (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# USER MANAGEMENT
# First remove default "ubuntu" user (UID 1000)
RUN userdel -r ubuntu || true
RUN groupdel ubuntu || true

# Now create group and user "harry" cleanly
RUN groupadd -g ${GID} harry
RUN useradd -u ${UID} -g ${GID} -m -s /bin/bash harry

# 2. CHANGE: Enable color prompt in .bashrc
# Uncomment 'force_color_prompt=yes' line in user config file
RUN sed -i 's/^#force_color_prompt=yes/force_color_prompt=yes/' /home/harry/.bashrc

# Optionally: Add useful aliases (e.g., 'll' as detailed list)
RUN echo "alias ll='ls -alF'" >> /home/harry/.bashrc



# Set working directory
WORKDIR /app

# Set permissions
RUN chown -R harry:harry /app

# Copy project files (needed for npm install on startup)
COPY --chown=harry:harry package.json package-lock.json* ./

# Switch to user
USER harry

# Start command
CMD ["/bin/bash"]