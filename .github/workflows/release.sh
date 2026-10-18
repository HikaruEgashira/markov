#!/bin/bash
set -euo pipefail

# Check whether the current version can be published to npm.
# can-npm-publish exits with 0 when the version is publishable and 1 otherwise.
CAN_PUBLISH=false
if npx --yes can-npm-publish; then
  CAN_PUBLISH=true
fi

# Expose the result to the workflow so the remaining steps can be skipped
# when there is nothing to release.
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "can_publish=${CAN_PUBLISH}" >> "${GITHUB_OUTPUT}"
fi

if [ "${CAN_PUBLISH}" != "true" ]; then
  echo "The version in package.json is already published. Skipping release."
  exit 0
fi

# Get current version from package.json
TAG=$(node -p "require('./package.json').version")
echo "add new tag to GitHub: ${TAG}"

# Add tag to GitHub
API_URL="https://api.github.com/repos/${REPO}/git/refs"

curl -sS -f -X POST "${API_URL}" \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -d @- << EOS
{
  "ref": "refs/tags/${TAG}",
  "sha": "${COMMIT}"
}
EOS
