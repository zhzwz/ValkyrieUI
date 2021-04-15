# clear
echo "\033[2J"

# version
echo "\033[33mVersion:\033[0m"
yarn version --no-git-tag-version --patch

# rollup
echo "\033[33m\nRollup:\033[0m"
yarn rollup --config

# copy
echo "\033[33m\nCopy:\033[0m"
if (type pbcopy >/dev/null 2>&1) then
  echo "\033[1;36mbundle/Valkyrie.user.js\033[0;36m...\033[0m"
  pbcopy < bundle/Valkyrie.user.js
  echo "\033[32mcopied to clipboard.\033[0m"
else
  echo "\033[36mcommand not found: pbcopy\033[0m"
fi

# end
echo ""
