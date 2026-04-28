#!/bin/bash
export PATH=$PATH:/root/.local/bin
cd /opt/zakazhi
export NODE_ENV=production
export NODE_OPTIONS='--max-old-space-size=2048'
/root/.local/bin/wasp start
