const GIPHY_API_URL = 'https://api.giphy.com';
const GIPHY_PUB_KEY = '8gCviBrlxd07gmYMk9hfKYgQUwTYTP4Q';

const styles = {
	margin: '0 auto',
	textAlign: 'center',
	width: '90%'
};

App = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.getDefaultState();

		this.handleSearch = this.handleSearch.bind(this);
		this.resetScreen = this.resetScreen.bind(this);
		this.updateGif = this.updateGif.bind(this);
	}

	getDefaultState() {
		return {
			loading: false,
			searchingText: '',
			gif: {}
		};
	}

	resetScreen() {
		this.setState(this.getDefaultState());
	}

	handleSearch(searchingText) {
		this.setState({
			loading: true
		});

		this.getGif(searchingText)
			.then(this.updateGif)
			.catch(this.resetScreen);
	}

	getGif(searchingText) {
		const url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
		return new Promise(
			(resolve, reject) => {
				const request = new XMLHttpRequest();
				request.open('GET', url);
				request.onload = function() {
					if (request.status === 200) {
					   var data = JSON.parse(request.responseText).data;
						var gif = {
							url: data.fixed_width_downsampled_url,
							sourceUrl: data.url
						};
						resolve(gif, searchingText);
					} else {
						reject(new Error(this.statusText));
					}
				};
				request.onerror = function() {
					reject(new Error(
					   `XMLHttpRequest Error: ${this.statusText}`));
				};
				request.send();
			}
		)
	}

	updateGif(gif, searchingText) {
		this.setState({
			loading: false,
			gif,
			searchingText
		});
	}

    render() {
		return (
			<div style={styles}>
				<h1>Wyszukiwarka GIFow!</h1>
				<p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
				<Search
					onSearch={this.handleSearch}
				/>
				<Gif
					loading={this.state.loading}
					url={this.state.gif.url}
					sourceUrl={this.state.gif.sourceUrl}
				/>
			</div>
		);
	}
}