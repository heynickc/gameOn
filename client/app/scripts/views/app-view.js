/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function() {
	'use strict';

	App.Views.AppView = Backbone.View.extend({

		el: '#app-view',

		template: JST['app/scripts/templates/app-view.ejs'],

		tagName: 'div',

		id: '',

		className: '',

		events: {},

		initialize: function() {
			this.addAllPlayers();

			this.listenTo(App.Players, 'add', this.addPlayer);
			this.listenTo(App.Players, 'reset', this.addAllPlayers);
		},

		addPlayer: function(model) {
			var view = new App.Views.PlayerView({
				model: model
			});

			$('#player-list').append(view.render().el);
		},

		addAllPlayers: function() {
			$('#player-list').html('');
			App.Players.fetch();
			App.Players.each(this.addPlayer, this);
		}
	});
})();