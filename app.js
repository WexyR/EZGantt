$(function () {
	var queryParams = getQueryParams();
	var layout = queryParams.layout || '';
	var config = {
		settings: {
			hasHeaders: true,
			constrainDragToContainer: true,
			reorderEnabled: true,
			selectionEnabled: false,
			popoutWholeStack: false,
			blockedPopoutsThrowError: true,
			closePopoutsOnUnload: false,
			showPopoutIcon: false,
			showMaximiseIcon: true,
			showCloseIcon: false
		},
		dimensions: {
			borderWidth: 5,
			minItemHeight: 10,
			minItemWidth: 10,
			headerHeight: 20,
			dragProxyWidth: 300,
			dragProxyHeight: 200
		},
		labels: {
			close: 'close',
			maximise: 'maximise',
			minimise: 'minimise',
			popout: 'open in new window'
		},
		content: [ /* see item config */]
	};

	config.content = createDefaultContent();

	window.myLayout = new GoldenLayout(config);
	window.myLayout.registerComponent('html', function (container, state) {
		container
			.getElement()
			.html(state.html ? state.html.join('\n') : '<p>' + container._config.title + '</p>');

		if (state.style) {
			$('head').append('<style type="text/css">\n' + state.style.join('\n') + '\n</style>');
		}

		if (state.className) {
			container.getElement().addClass(state.className);
		}
	});

	myLayout.on('tabCreated', function (tab) {
		tab.closeElement.off('click');
	});

	myLayout.on('componentCreated', function (component) {
		if (component.config.hasHeader == false) {
			component.tab.header.position(false);
		}
	});
	myLayout.init();



	function getQueryParams() {
		var params = {};
		window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
			var parts = pair.split('=');
			if (parts.length > 1) {
				params[decodeURIComponent(parts[0]).toLowerCase()] = decodeURIComponent(parts[1]);
			}
		});
		return params;
	}

	function createDefaultContent() {
		return [
			{
				type: 'row',
				content: [

					{
						width: 20,
						type: 'column',
						content: [
							{
								width: 20,
								type: 'stack',
								content: [

									{
										type: 'stack',
										componentName: 'html',
										title: 'Planification',
										content: [
											{
												type: 'component',
												componentName: 'html',
												title: 'Créer nouvelle tache',
												componentState: {
													html: [
 														'<p> \
 														<label for="task-creation-name">Nom tache</label> : \
 														<input type="text" name="task-creation-name" id="task-creation-name" placeholder="Tache #1" value="Tache #1" required> \
 														<span id="task-name-bubble"></span> \
 														</p> \
 														<p> \
 														<label for="task-creation-date">Début Tache</label> : \
 														<input type="date" name="task-creation-date" id="task-creation-date" value="2019-06-03" required> \
 														<span id="task-date-bubble"></span> \
 														<br> \
 														<input type="checkbox" id="task-creation-precision-mode" name="task-creation-precision-mode" checked> \
 														<label for="task-creation-precision-mode">Précision élevée</label> :  \
 															<input type="time" id="task-creation-precise-creation-time" enabled="" checked> \
 														<script>document.getElementById("task-creation-precision-mode").onchange = function() {document.getElementById("task-creation-precise-creation-time").disabled = !this.checked;};</script> \
 														</p> \
 														<p> \
 														<label for="task-creation-weight">Poids tache</label> : \
 														<input type="number" name="task-creation-weight" id="task-creation-weight" value=10 min=0 max=255 required> \
 														<span id="task-weight-bubble"></span> \
 														</p> \
														 <button onclick="console.log(document.getElementById(\'task-creation-date\').value); \
														 if(document.getElementById(\'task-creation-weight\').value<0) document.getElementById(\'task-creation-weight\').value=0; \
														let t = new Task(undefined, begin, document.getElementById(\'task-creation-name\').value, document.getElementById(\'task-creation-weight\').value); \
														t.setTimeDate(new Date(document.getElementById(\'task-creation-date\').value), undefined, new Duration(0, 0, 0, 0, 0, 1)); \
														graph.registerComponent(t); \
														graph.updateContext();">Créer</button>'
													]
												}
											},
											{
												type: 'component',
												componentName: 'html',
												title: 'Modifier tache existante',
												componentState: {
													html: [
 														'<p> \
 														<label for="task-name">Nom tache:</label> : \
 														<input type="text" name="pseudo" id="pseudo" required> \
 														<span id="task-name-bubble"></span> \
 														</p> \
 														<p> \
 														<label for="task-name">Nom tache:</label> : \
 														<input type="text" name="pseudo" id="pseudo" required> \
 														<span id="task-name-bubble"></span> \
 														</p> \
 														<p> \
 														<label for="task-name">Nom tache:</label> : \
 														<input type="text" name="pseudo" id="pseudo" required> \
 														<span id="task-name-bubble"></span> \
 														</p>'
													]
												}
											}
										]
									},
									{
										type: 'component',
										componentName: 'html',
										title: 'Rapport d\'activité'
									}
								]
							},
							{
								width: 20,
								type: 'stack',
								content: [
									{
										type: 'component',
										title: 'Projets',
										componentName: 'html',
										componentState: { bg: 'golden_layout_spiral.png' }
									},
									{
										type: 'component',
										title: 'Taches',
										componentName: 'html',
									}
								]
							}
						]
					},
					{
						type: 'component',
						title: 'Diagramme',
						componentName: 'html',
						width: 80,
						hasHeader: false,
						componentState: {
							className: 'main-gant',
							style: [
								'.main-gant label {',
								'  margin-top: 10px;',
								'  display: block;',
								'  text-align: left;',
								'}',
								'.main-gant input {',
								'  width: 250px;',
								'  border: 1px solid red',
								'}'
							],
							html: [
								'<canvas id="graph" width="600" height="400"></canvas> \
								<script>if(!graph.render()) graph.updateContext();</script>'
							]
						}
					}
				]
			}
		];
	}
});

/*
myLayout.on('tabCreated', function(tab){
   tab.closeElement.off( 'click' ).click(function(){
      if( confirm( 'You have unsaved changes, are you sure you want to close this tab' ) ) {
         tab.contentItem.remove();
      }
   })
})
*/