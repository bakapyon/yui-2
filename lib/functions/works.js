"use strict";
const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');
const {
	tools
} = require('./index');
const {
	mylang
} = require('../lang');
const {
	exec
} = require('child_process');

// JSON's & Utilidades;
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));
axios.defaults.headers.common['User-Agent'] = config.User_Agent;
var Broad_Cast = '';

// Verifica se a pessoa desligou a Yui com segurança;
exports.safeBoot = () => {
	if (config.SafeBoot == true) {
		config.SafeBoot = false;
		fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
	} else {
		const sBMess = mylang(config.Language).badshtd();
		console.log(tools('others').color('[Yui 🙂]', 'magenta'), tools('others').color(sBMess.join(' | '), 'lime') + '\n'); // Pula linha no terminal;
		if (config.Popup) {
			sBMess.map((msr, idx) => {
				tools('others').sleep(5000).then(() => tools('others').notify('Yui', msr, `./lib/media/img/${idx}.png`));
			});
		}
	}
};

// Sistema de Transmissão de Emergência com atraso de 1 hora para evitar sobrecarga, básico mas funcional;
exports.transmission = () => {
	try {
		if (config.Enable_EAS) {
			if (Broad_Cast !== false) {
				axios.get("https://pastebin.com/raw/mhDCmaszg").then(govMess => {
					if (Broad_Cast !== govMess.data) {
						Broad_Cast = govMess.data;
						console.log(tools('others').color('[pyon]', 'magenta'), tools('others').color(govMess.data, 'lime') + '\n');
						if (config.Popup) {
							tools('others').notify('pyon', govMess.data, './lib/media/img/kill.png');
						}
					}
					tools('others').sleep(3600000).then(() => tools('works').transmission()) /* Adquire informações transmitidas por mim de 1 em 1 hora */ ;
				}).catch(err => {
					Broad_Cast = false;
					return console.log(err.message);
				});
			}
		}
	} catch (error) {
		Broad_Cast = false;
		return console.log(error.message);
	}
};

// Faz backups periódicos durante a execução;
exports.backup = () => {
	try {
		if (config.Enable_Backups) {
			let backMess = mylang(config.Language).bkpfinish();
			console.log(tools('others').color('[Yui 🙂]', 'magenta'), tools('others').color(backMess.join(' | '), 'lime') + '\n');
			if (config.Popup) {
				backMess.map((msr, idx) => {
					tools('others').sleep(5000).then(() => tools('others').notify('Yui', msr, `./lib/media/img/${idx}.png`));
				});
			}
			exec(`bash -c 'zip -r "lib/config/Backups/${moment().format('DD-MM-YY # HH-mm-ss')}.zip" lib/config -x "*lib/config/Utilidades*" -x "*lib/config/Backups*"'`, (err) => {
				if (err) return console.log(tools('others').color(`[BACKUP]`, 'crimson'), tools('others').color(`→ O Backup obteve uns problemas mas você pode ignorar - ou não. → "${err.message}"`, 'gold') + '\n');
				console.log(tools('others').color(`[BACKUP]`, 'crimson'), tools('others').color(`→ O Backup periódico foi concluído com sucesso!`, 'gold') + '\n');
				tools('others').sleep(3600000).then(() => tools('works').backup());
			});
		}
	} catch (err) {
		console.log(err.message);
	}
};