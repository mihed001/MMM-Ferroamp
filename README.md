# MMM-SolarEdge
A Solar Module for MagicMirror2 designed to integrate with a Ferroamp System

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone repo into MagicMirror/modules directory
  2. Create an entry in 'config/config.js' with your API Key, SiteID and any config options.

 **Example:**
```
 {
    module: 'MMM-Ferroamp',
	position: 'top_right',
	config: {
		apiKey: "################################", //Requires your own API Key
		siteId: "12345", //Ferroamp site ID
	}
 },
```
**Note:** Only enter your API Key in the `config.js` file. Your API Key is yours alone, _do not_ post or use it elsewhere.

## Optional Config
| **Option** | **Description** |
| --- | --- |
| `basicHeader` | Set to `true` to substitute the 'Solar PV' text and graphic for the default MagicMirror header |

## API Key
Use of this module requires
  1. An API Key, which you can obtain by emailing Ferroamp support (e.g support-uk@solaredge.com )
  2. The Site ID of the Ferroamp system you wish to monitor.
