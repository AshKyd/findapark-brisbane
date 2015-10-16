# CD into the script folder, rather than the cwd.
cd "$( dirname "${BASH_SOURCE[0]}" )";

rm -rf temp dist;
mkdir temp dist;
cd temp;

# Wifi in parks
wget 'http://mapsengine.google.com/map/kml?mid=za0oXX8LG3tg.k3royNIyqLhE' -O file1 &

# Wifi in the CBD
wget 'http://mapsengine.google.com/map/kml?mid=za0oXX8LG3tg.kZrAenFN6YbE' -O file2;

wait;

unzip file1 -d dir1 >/dev/null &
unzip file2 -d dir2 >/dev/null;

wait;
cd ..;

node helpers/togeojson temp/dir1/doc.kml > dist/parks.geojson &
node helpers/togeojson temp/dir2/doc.kml > dist/cbd.geojson &
node helpers/parselibrariesparks.js > dist/librariesandparks.geojson;
cp static/*.geojson dist/;

wait;

rm temp -rf;

# This echoes to stdout
node helpers/combinegeojson;
