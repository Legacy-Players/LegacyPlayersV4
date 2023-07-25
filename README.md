# LegacyPlayers Reboot
[![docker-compose-actions-workflow](https://github.com/YamaYAML/LegacyPlayersV4/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/YamaYAML/LegacyPlayersV4/actions/workflows/build.yml)

Welcome to the next iteration of LegacyPlayers, the beloved hub for sharing World of Warcraft experiences. Our new home is [https://legacyplayers.info/](https://legacyplayers.com/).

This project is a reboot of [LegacyPlayersV3](https://github.com/Geigerkind/LegacyPlayersV3) by Geigerkind, designed to resolve the scalability issues encountered by previous iterations and ensuring a smoother, richer experience for users.

## Special Thanks

Special thanks to the original project, LegacyPlayersV3, for laying the foundation of this work. Also to the [Turtle WoW](https://turtle-wow.org/) project for their continuous support and inspiration.

## License

LegacyPlayers is open-source and licensed under the MIT license. Users are free to host their own versions with the following conditions:

- No monetization through the site is allowed.
- Any improvements to the existing code must be contributed back to the main repository.

## Deployment

Docker and Docker-compose are required for deployment. After installation, run `docker-compose up -d` to launch the website on port 80. Please note that the database in the repository serves only as an example.

## Performance

Tuning the database configurations is advised to alleviate the current performance bottlenecks. The backend might also require a significant amount of RAM.

## Existing Bugs

Several bugs are currently present, including incorrect parsing of some raids. Also, the ModelViewer is yet to be integrated. If you wish to do so, you must fetch the necessary resources independently.

## Development

For contributing to the development of the project, please follow the installation instructions as described in the original text. We encourage contributions from everyone who loves World of Warcraft as much as we do!

Join us in enhancing LegacyPlayers and preserving the rich history of WoW!
