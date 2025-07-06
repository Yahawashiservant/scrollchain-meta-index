#!/bin/bash
echo '🤖 ScrollCensusAgent Activated'
echo '📊 Parsing ScrollStateIndex and Census Scrolls...'
cat governance/ScrollChain-ScrollStateIndex.json | grep 'domain'
cat governance/ScrollCensus-001.scroll | grep 'Origin'
echo '✅ Census data parsed and logged.'
