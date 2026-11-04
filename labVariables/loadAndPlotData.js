//Credit: Chris Arthey and Alex Brinson
class FeedPlot {
    constructor(feedKey, parent, data) {
        this.feedKey = feedKey;
        this.container = parent;
        this.div = document.createElement('div');
        this.div.className = 'plot';
        this.title = document.createElement('h2');
        this.title.textContent = this.feedKey;
        this.updateLabel = document.createElement('p');
        this.updateLabel.id = this.feedKey + '-update';
        this.updateLabel.textContent = '(No updates yet)';
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.feedKey + '-canvas';

        this.div.appendChild(this.title);
        this.div.appendChild(this.canvas);
        this.div.appendChild(this.updateLabel);
        this.container.appendChild(this.div);

        this.config = {
            type: 'line',
            data: {datasets: 
                [{label: this.feedKey, 
                data: [],
                borderWidth: 1}]
            },
            options: {scales: {
                x: {type: 'linear'},
                y: {type: 'linear'}}
            }
        };

        this.chart = new Chart(this.canvas, this.config);

        // newest measurement at x = 0
        this.chart.options.scales.x.max = 0;

        // use data which has already been fetched
        this.loadHistory(data);
    }

    // plots the last 1000 measurements
    loadHistory(data) {
        this.data = [...data];
        this.data.reverse();
        // newest measurement
        this.latest = new Date(this.data[this.data.length - 1].created_at);
        this.updateLabel.textContent = 'Last update: ' + this.latest.toLocaleString();
        // create points for this particular feed
        this.points = this.data.map(d => {
            // each device-server value contains all feeds
            const device_data = JSON.parse(d.value);
            return {
                x: (new Date(d.created_at) - this.latest) / 1000,
                y: Number(device_data[this.feedKey].value)
            }});
        this.setData();
    }

    setData() {
        const xMin = this.points[0].x;
        this.chart.options.scales.x.min = xMin;
        this.chart.data.datasets[0].data = this.points;
        this.chart.update();
    }


    // update using data which has already been fetched
    update(newest) {
        const timestamp = new Date(newest.created_at);
        const time_elapsed = (timestamp - this.latest)/1000;
        if (time_elapsed > 0) {
            this.latest = timestamp;
            this.updateLabel.textContent = 'Last Update: ' + this.latest.toLocaleString();
            this.points = this.points.map(p => ({
                    x: p.x - time_elapsed,
                    y: p.y
                }));

            this.points.shift();

            // newest.value contains ALL feeds
            const device_data = JSON.parse(newest.value);

            // select only the data belonging to this plot
            const point = {
                x: 0,
                y: Number(device_data[this.feedKey].value)
            };
            this.points.push(point);
            this.setData();
        }
    }
}



// fetches the complete device-server feed
async function getFeedData(limit) {
    const response = await fetch(
        `https://io.adafruit.com/api/v2/brinsino/feeds/device-server/data?limit=${limit}`
    );
    const data = await response.json();
    return data;
}

// gets the feed names from the already loaded data
function getFeeds(data) {
    // Adafruit returns newest data first
    const device_data = JSON.parse(data[0].value);
    const feeds = Object.keys(device_data);
    return feeds;
}

async function startup() {
    const container = document.getElementById('plots');
    // FETCH THE HISTORY ONLY ONCE
    const data = await getFeedData(1000);
    // determine what plots we need from that data
    const feeds = getFeeds(data);
    console.log('Feeds: ', feeds);
    const plots = {};
    // all plots use the SAME fetched data
    for (const feed of feeds) {
        plots[feed] = new FeedPlot(
            feed,
            container,
            data
        );
    }

    setInterval(async () => {
        // FETCH THE NEWEST DATA ONLY ONCE
        const data = await getFeedData(1);
        const newest = data[0];
        // all plots use the same newest data
        for (const feed of feeds) {plots[feed].update(newest)}}, 1000)}

startup();