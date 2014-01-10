if [ $# -eq 0 ]
then
    scp -p ~/workspace/islay3d/* hpmanager@islayflash.cis.ibaraki.ac.jp:htdocs/islay3d/
    scp -rp ~/workspace/islay3d/js hpmanager@islayflash.cis.ibaraki.ac.jp:htdocs/islay3d/
    scp -rp ~/workspace/islay3d/php hpmanager@islayflash.cis.ibaraki.ac.jp:htdocs/islay3d/
else
    scp -rp ~/workspace/islay3d/$1 hpmanager@islayflash.cis.ibaraki.ac.jp:htdocs/islay3d/
fi
