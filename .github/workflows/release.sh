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

# Add the tag only when it does not exist yet. The tag is created before the
# package is published, so a previous failed run may already have tagged this
# version; posting it again would return HTTP 422 and fail the whole job, which
# is why an already-published version could keep failing the release.
REFS_URL="https://api.github.com/repos/${REPO}/git/refs"
REF_URL="https://api.github.com/repos/${REPO}/git/ref/tags/${TAG}"
STATUS=$(curl -sS -o /dev/null -w '%{http_code}' \
  -H "Authorization: token ${GITHUB_TOKEN}" "${REF_URL}")

if [ "${STATUS}" = "200" ]; then
  echo "tag ${TAG} already exists; reusing it"
elif [ "${STATUS}" = "404" ]; then
  curl -sS -f -X POST "${REFS_URL}" \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -d @- << EOS
{
  "ref": "refs/tags/${TAG}",
  "sha": "${COMMIT}"
}
EOS
else
  echo "unexpected response checking tag ${TAG}: HTTP ${STATUS}" >&2
  exit 1
fi
