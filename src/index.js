import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

fetch('./assets/data/brasil_estados_simplificados.geojson')
	.then((file) => file.json())
	.then((brazil_states_data) => {
		const map_interaction = document.getElementById('map-interaction');
		const modal = document.getElementById('modal');
		const modal_text = modal.querySelector('#modal-text');
		const modal_button = modal.querySelector('#modal-button');
		const name_text = document.querySelector('#name h3');
		const colors = [
			['rgb(255, 100, 100)', './assets/audio/red.mp3'],
			['rgb(130, 255, 130)', './assets/audio/green.mp3'],
			['rgb(80, 80, 255)', './assets/audio/blue.mp3'],
			['rgb(255, 255, 100)', './assets/audio/yellow.mp3'],
		];
		const bounds = [
			[-40, -80],
			[13, -20],
		];
		let game_states = [];
		const map = L.map('map', {
			center: [-15, -50],
			zoom: 5,
			maxZoom: 6,
			minZoom: 5,
			zoomControl: false,
			maxBounds: bounds,
		});

		const brazil_states_lyr = L.geoJSON(brazil_states_data, { color: '#fff' }).addTo(map);

		function startGame() {
			modal.classList.add('hide');
			map.fitBounds(bounds);
			mapGenius();
		}

		function endGame() {
			const audio = new Audio('./assets/audio/error.wav');
			audio.play();
			const hits = game_states.length === 1 ? 0 : game_states.length;
			modal_text.innerHTML = `Você conseguiu acertar ${hits} consecutiva(s)`;
			game_states = null;
			game_states = [];
			modal.classList.remove('hide');
		}

		function brazilStateClick(event) {
			const state_name = event.layer.feature.properties['NM_ESTADO'];
			const states = game_states.filter((item) => item.game_bool === false);
			const [current_game_state] = states;
			const current_state_name = current_game_state.feature.properties['NM_ESTADO'];
			const game_status = state_name === current_state_name;
			current_game_state.game_bool = true;
			game_status ? highlightCountry(current_game_state) : endGame();
			if (states.length === 1 && game_status) {
				game_states.forEach((item) => {
					item.game_bool = false;
				});
				setTimeout(() => {
					map_interaction.classList.remove('hide');
					map.fitBounds(bounds);
					mapGenius();
				}, 250);
			}
		}

		function highlightCountry({ color, sound, feature }) {
			const temp_feature = L.geoJSON(feature, { color: color }).addTo(map);
			const [temp_layer] = temp_feature.getLayers();
			const state_name = temp_layer.feature.properties['NM_ESTADO'];
			name_text.innerHTML = state_name;
			const audio = new Audio(sound);
			audio.play();
			setTimeout(() => map.removeLayer(temp_feature), 250);
		}

		function mapGenius() {
			const [color, sound] = colors[Math.floor(Math.random() * 4)];
			const feature = brazil_states_data.features[Math.floor(Math.random() * 27)];
			const game_bool = false;
			game_states.push({ color, sound, feature, game_bool });
			let interval = setInterval(
				(generator) => {
					const { value, done } = generator.next();
					done ? clearInterval(interval) : highlightCountry(value);
				},
				1000,
				game_states[Symbol.iterator]()
			);
			setTimeout(() => map_interaction.classList.add('hide'), game_states.length * 1000);
		}
		brazil_states_lyr.on('click', (event) => brazilStateClick(event));
		modal_button.addEventListener('click', () => startGame());
	});
