(function (thisObj) {
     scriptBuildUI(thisObj);

     function scriptBuildUI(thisObj) {
          var win = thisObj instanceof Panel ? thisObj : new Window('window', 'Planning creation assistant', undefined, {
               resizeable: false,
               closeButton: false,
          });

          function BuildDlg(textLayer1, textLayer2) {
               // Dialog UI
               var textDlg = new Window('palette', 'Texte', undefined, {
                    resizeable: false
               });
               textDlg.orientation = 'row';
               var group1 = textDlg.add('panel', undefined, 'Texte');
               var inputText = group1.add('edittext', undefined, '');
               var ddTypo = group1.add('dropdownlist', undefined, fonts);
               var group2 = textDlg.add('panel', undefined, 'Font size');
               var buttonUp = group2.add('button', undefined, '↑');
               var buttonDown = group2.add('button', undefined, '↓');

               group1.orientation = 'column';
               group1.spacing = 15;
               group2.orientation = 'column';
               inputText.size = [150, 25];
               ddTypo.size = [150, 25];
               ddTypo.selection = 2
               buttonUp.size = [25, 25];
               buttonDown.size = [25, 25];

               // FUNCTIONS
               function TextSize(arg) {
                    var textProp = textLayer1.property("Source Text");
                    var textDocument = textProp.value;
                    var acutalSize = textDocument.fontSize
                    arg ? textDocument.fontSize = acutalSize + 1 : textDocument.fontSize = acutalSize - 1;
                    textProp.setValue(textDocument);
               }

               function TextFont(typo) {
                    var textProp1 = textLayer1.property("Source Text");
                    var textDocument1 = textProp1.value;
                    textDocument1.font = typo;
                    textProp1.setValue(textDocument1);

                    var textProp2 = textLayer2.property("Source Text");
                    var textDocument2 = textProp2.value;
                    textDocument2.font = typo;
                    textProp2.setValue(textDocument2);
               }

               function TextValue(userInput) {
                    var textProp1 = textLayer1.property("Source Text");
                    var textDocument1 = textProp1.value;
                    textDocument1.text = userInput;
                    textProp1.setValue(textDocument1);

                    var textProp2 = textLayer2.property("Source Text");
                    var textDocument2 = textProp2.value;
                    textDocument2.text = userInput;
                    textProp2.setValue(textDocument2);
               }

               function RepositionAnchorPoint(layer) {
                    var layerAnchor = layer.anchorPoint.value;
                    /* find center by bounding box of the layer */
                    var x = layer.sourceRectAtTime(0, false).width / 2;
                    var y = layer.sourceRectAtTime(0, false).height / 2;
                    /* we need this for text layer */
                    x += layer.sourceRectAtTime(0, false).left;
                    y += layer.sourceRectAtTime(0, false).top;
                    var xAdd = (x - layerAnchor[0]) * (layer.scale.value[0] / 100);
                    /* set new anchor point*/
                    layer.anchorPoint.setValue([x, y]);
                    var layerPosition = layer.position.value;
                    layer.name == 'Texte personnalisé 1' ? layer.position.setValue([400, 57]) : layer.position.setValue([layerPosition[0] + xAdd, 57]);
               };

               // EVENT HANDLER
               inputText.addEventListener('changing', function (e) {
                    TextValue(e.target.text);
               });
               ddTypo.addEventListener('change', function (e) {
                    TextFont(e.target.selection.toString());
                    RepositionAnchorPoint(textLayer1);
               });
               buttonUp.addEventListener('mousedown', function (e) {
                    TextSize(true);
                    RepositionAnchorPoint(textLayer1);
               });
               buttonDown.addEventListener('mousedown', function (e) {
                    TextSize(false);
                    RepositionAnchorPoint(textLayer1);
               });
               textDlg.show();
          }


          win.spacing = 10;

          const dt = new Date();
          const actualDay = dt.getDate() - 1;
          const actualMonth = dt.getMonth();

          const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
          const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
          const hours = ['6h', '7h', '8h', '9h', '10h', '11h', '12h', '-', '13h', '14h', '15h', '16h', '17h', '18h', '-', '19h', '20h', '21h', '22h', '23h'];

          const fonts = ['Le-Havre-City-Light', 'HeroNew-Thin', 'LeHavre-Bla'];

          const games = new Array();
          const compTemplate = GetCompByName('0 -  Template')
          for (var i = 1; i <= compTemplate.numLayers; i++) {
               var nameFormated = compTemplate.layer(i).name.replace(/\..+$/, '')
               games.push(nameFormated);
               compTemplate.layer(i).name = nameFormated;
          }

          const activeDays = new Array();

          // Main window UI
          var activationPanel = win.add('panel', undefined, 'Activation')
          activationPanel.orientation = 'row'
          var buttonActivateLundi = activationPanel.add('checkbox', undefined, 'Lundi', {
               name: '1 - Lundi'
          });
          var buttonActivateMardi = activationPanel.add('checkbox', undefined, 'Mardi', {
               name: '2 - Mardi'
          });
          var buttonActivateMercredi = activationPanel.add('checkbox', undefined, 'Mercredi', {
               name: '3 - Mercredi'
          });
          var buttonActivateJeudi = activationPanel.add('checkbox', undefined, 'Jeudi', {
               name: '4 - Jeudi'
          });
          var buttonActivateVendredi = activationPanel.add('checkbox', undefined, 'Vendredi', {
               name: '5 - Vendredi'
          });
          var buttonActivateSamedi = activationPanel.add('checkbox', undefined, 'Samedi', {
               name: '6 - Samedi'
          });
          var buttonActivateDimanche = activationPanel.add('checkbox', undefined, 'Dimanche', {
               name: '7 - Dimanche'
          });

          var tabsDay = win.add('tabbedpanel', undefined, '');

          // TEMPLATE
          function CreateTab(day) {
               return "tab { alignChildren: 'top', text: '" + day.slice(4) + "',  \
                    panelSettings: Panel { orientation: 'column', text: 'Layout', \
                         buttonOneSpace: Button {text: 'One space', name: '" + day + "'}, \
                         buttonTwoSpace: Button {text: 'Two space', name: '" + day + "'} \
                         buttonOpen: Button {text: 'Ouvrir la comp', name: '" + day + "'} \
                    }, \
                    groupPanels: Group { orientation: 'column', \
                         panelOne: Panel { alignChildren: 'left', text: 'Première case', \
                              groupHours: Group { orientation: 'row', \
                                   ddHour: DropDownList { title: 'Heure :', name: '" + day + "' }, \
                                   checkboxFifteen: Checkbox { text: '15', name: '" + day + "' }, \
                                   checkboxThirty: Checkbox { text: '30', name: '" + day + "' }, \
                                   checkboxFortyfive: Checkbox { text: '45', name: '" + day + "' } \
                              }, \
                              ddCategorie: DropDownList { title: 'Catégorie :', name: '" + day + "' } \
                         }, \
                         panelTwo: Panel { alignChildren: 'left', text: 'Deuxième case', \
                              groupHours: Group { orientation: 'row', \
                                   ddHour: DropDownList { title: 'Heure :', name: '" + day + " bis' }, \
                                   checkboxFifteen: Checkbox { text: '15', name: '" + day + " bis' }, \
                                   checkboxThirty: Checkbox { text: '30', name: '" + day + " bis' }, \
                                   checkboxFortyfive: Checkbox { text: '45', name: '" + day + " bis' } \
                              }, \
                              ddCategorie: DropDownList { title: 'Catégorie :', name: '" + day + "' } \
                         } \
                    } \
               }";
          };

          // JOURS
          tabsDay.add(CreateTab('1 - Lundi'));
          tabsDay.add(CreateTab('2 - Mardi'));
          tabsDay.add(CreateTab('3 - Mercredi'))
          tabsDay.add(CreateTab('4 - Jeudi'));
          tabsDay.add(CreateTab('5 - Vendredi'));
          tabsDay.add(CreateTab('6 - Samedi'));
          tabsDay.add(CreateTab('7 - Dimanche'));

          // BOTTOM
          var groupBottom = win.add('group', undefined, 'GroupBottom');
          groupBottom.orientation = 'column';
          var groupDate = groupBottom.add('group', undefined, 'groupDate');
          groupDate.orientation = 'row';
          var ddDays = groupDate.add('dropdownlist', undefined, days);
          var ddMonths = groupDate.add('dropdownlist', undefined, months);
          var buttonApply = groupDate.add('button', undefined, 'Appliquer')
          ddDays.selection = actualDay;
          ddMonths.selection = actualMonth;
          var groupButtons = groupBottom.add('group', undefined, 'groupDate');
          groupButtons.orientation = 'row';
          var buttonClear = groupButtons.add('button', undefined, 'Nettoyer');
          var buttonExport = groupButtons.add('button', undefined, 'Exporter');
          var buttonClose = groupBottom.add('button', undefined, 'Fermer');

          // UI design
          tabsDay.size = [475, 300];

          function ItemType(item) {
               var type;
               item === '-' ? (type = 'separator') : (type = 'item')
               return type;
          }

          const tabsObject = tabsDay.children;
          for (var i = 0; i < tabsObject.length; i++) {
               tabsObject[i].spacing = 25
               for (var j = 0; j < hours.length; j++) {
                    tabsObject[i].groupPanels.panelOne.groupHours.ddHour.add(ItemType(hours[j]), hours[j]);
                    tabsObject[i].groupPanels.panelTwo.groupHours.ddHour.add(ItemType(hours[j]), hours[j]);
               };
               for (var j = 0; j < games.length; j++) {
                    tabsObject[i].groupPanels.panelOne.ddCategorie.add('item', games[j]);
                    tabsObject[i].groupPanels.panelTwo.ddCategorie.add('item', games[j]);
               };
               tabsObject[i].margins = 10;

               tabsObject[i].groupPanels.panelOne.groupHours.ddHour.size = [125, 40];
               tabsObject[i].groupPanels.panelTwo.groupHours.ddHour.size = [125, 40];

               tabsObject[i].groupPanels.panelOne.ddCategorie.size = [125, 40];
               tabsObject[i].groupPanels.panelTwo.ddCategorie.size = [125, 40];

               tabsObject[i].groupPanels.panelTwo.enabled = false;

               tabsObject[i].orientation = 'row';
               tabsObject[i].enabled = false;

               // EVENT HANDLER
               // Buttons and checkbox
               //Open comp
               tabsObject[i].panelSettings.buttonOpen.addEventListener('mousedown', function (e) {
                    OpenComp(e.target.name)
               });
               // Toggle spaces
               tabsObject[i].panelSettings.buttonOneSpace.addEventListener('mousedown', function (e) {
                    ChangeLayout(true, e.target.name)
               });
               tabsObject[i].panelSettings.buttonTwoSpace.addEventListener('mousedown', function (e) {
                    ChangeLayout(false, e.target.name)
               });
               // Panel one
               tabsObject[i].groupPanels.panelOne.groupHours.checkboxFifteen.addEventListener('mousedown', function (e) {
                    ActivateQuarter(e.target, 15)
               });
               tabsObject[i].groupPanels.panelOne.groupHours.checkboxThirty.addEventListener('mousedown', function (e) {
                    ActivateQuarter(e.target, 30)
               });
               tabsObject[i].groupPanels.panelOne.groupHours.checkboxFortyfive.addEventListener('mousedown', function (e) {
                    ActivateQuarter(e.target, 45)
               });
               // Panel two
               tabsObject[i].groupPanels.panelTwo.groupHours.checkboxFifteen.addEventListener('mousedown', function (e) {
                    ActivateQuarter(e.target, 15)
               });
               tabsObject[i].groupPanels.panelTwo.groupHours.checkboxThirty.addEventListener('mousedown', function (e) {
                    ActivateQuarter(e.target, 30)
               });
               tabsObject[i].groupPanels.panelTwo.groupHours.checkboxFortyfive.addEventListener('mousedown', function (e) {
                    ActivateQuarter(e.target, 45)
               });
               // Dropdowns
               tabsObject[i].groupPanels.panelOne.groupHours.ddHour.addEventListener('change', function (e) {
                    SetHour(e.target, parseInt(e.target.name.slice(0, 1)))
               });
               tabsObject[i].groupPanels.panelTwo.groupHours.ddHour.addEventListener('change', function (e) {
                    SetHour(e.target, parseInt(e.target.name.slice(0, 1)) + 7)
               });
               tabsObject[i].groupPanels.panelOne.ddCategorie.addEventListener('change', function (e) {
                    SetCategorie(e.target, e.target.selection, e.target.name)
               });
               tabsObject[i].groupPanels.panelTwo.ddCategorie.addEventListener('change', function (e) {
                    SetCategorie(e.target, e.target.selection, e.target.name)
               });
          }


          function GetCompByName(itemName) {
               for (var i = 1; i <= app.project.numItems; i++) {
                    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === itemName) {
                         return app.project.item(i);
                    }
               }
          }

          function GetFolderByName(itemName) {
               for (var i = 1; i <= app.project.numItems; i++) {
                    if (app.project.item(i) instanceof FolderItem && app.project.item(i).name === itemName) {
                         return app.project.item(i);
                    }
               }
          }

          function GetTabByName(itemName) {
               for (var i = 0; i < tabsObject.length; i++) {
                    if (tabsObject[i].text == itemName) {
                         return tabsObject[i]
                    }
               }
          }

          function ActivateDay(button, day) {
               //Get comps
               const precompShapes = GetCompByName('shapes_precomp');
               const precompHours = GetCompByName('hours_precomp');
               const precompMask = GetCompByName('shapes_precomp_MASK')
               const compPlanning = GetCompByName('PLANNING')

               //Check button state
               if (!button.value) {
                    // Add to animation
                    activeDays.push(parseInt(day))
                    //Enable layers & tab
                    GetTabByName(day.slice(4)).enabled = true;
                    precompMask.layer(parseInt(day.slice(0, 1))).opacity.setValue(0);
               }
               if (button.value) {
                    // Remove from animation
                    activeDays.remove(parseInt(day));
                    //Disable layers & tab
                    GetTabByName(day.slice(4)).enabled = false;
                    compPlanning.layer(parseInt(day.slice(0, 1))).effect(1).property(1).setValue(0)
                    precompMask.layer(parseInt(day.slice(0, 1))).opacity.setValue(100)
                    precompShapes.layer(parseInt(day.slice(0, 1))).opacity.setValue(100)
                    precompHours.layer(parseInt(day.slice(0, 1)) + 7).opacity.setValue(0)
               }
          }

          function SetCategorie(dd, selection, compName) {
               const layer1 = GetCompByName(compName).layers.byName(selection);
               const layer2 = GetCompByName(compName + ' - Animated').layers.byName(selection);
               if (selection.toString() == 'Texte personnalisé' || selection.toString() == 'Texte personnalisé 2' || selection.toString() == 'Texte personnalisé 3') {
                    BuildDlg(layer1, layer2);
               }
               layer1.moveToBeginning();
               layer2.moveToBeginning();
          }

          function SetHour(dd, dayNumber) {
               const precompHours = GetCompByName('hours_precomp');
               dd.selection ? precompHours.layer(dayNumber).text.sourceText.setValue(dd.selection.toString()) : precompHours.layer(dayNumber).text.sourceText.setValue('Heure');
          }

          function ActivateQuarter(button, type) {
               const precompHours = GetCompByName('hours_precomp');
               !button.value ? precompHours.layers.byName('Heure - ' + button.name.slice(4) + ' - ' + type).opacity.setValue(100) : precompHours.layers.byName('Heure - ' + button.name.slice(4) + ' - ' + type).opacity.setValue(0);
          }

          function ChangeLayout(state, day) {
               const precompShapes = GetCompByName('shapes_precomp');
               const precompHours = GetCompByName('hours_precomp');
               state ? GetTabByName(day.slice(4)).groupPanels.panelTwo.enabled = false : GetTabByName(day.slice(4)).groupPanels.panelTwo.enabled = true;
               state ? precompShapes.layer(parseInt(day.slice(0, 1))).opacity.setValue(100) : precompShapes.layer(parseInt(day.slice(0, 1))).opacity.setValue(0);
               state ? precompHours.layer(parseInt(day.slice(0, 1)) + 7).opacity.setValue(0) : precompHours.layer(parseInt(day.slice(0, 1)) + 7).opacity.setValue(100);
               state ? activeDays.push(parseInt(day + 7)) : activeDays.remove(parseInt(day + 7));
          }

          function OpenComp(dayName) {
               GetCompByName(dayName).openInViewer();
          }

          function Clear() {
               const precompShapes = GetCompByName('shapes_precomp');
               const precompHours = GetCompByName('hours_precomp');
               const precompMask = GetCompByName('shapes_precomp_MASK')
               const compPlanning = GetCompByName('PLANNING')

               for (var i = 0; i < activationPanel.children.length; i++) {
                    activationPanel.children[i].value = false
               };

               for (var i = 0; i < tabsObject.length; i++) {
                    tabsObject[i].groupPanels.panelTwo.enabled = false;
                    tabsObject[i].enabled = false;
               }
               for (var i = 1; i <= 7; i++) {
                    precompMask.layer(i).opacity.setValue(100)
                    precompShapes.layer(i).opacity.setValue(100)
               };
               for (var i = 8; i <= 56; i++) {
                    precompHours.layer(i).opacity.setValue(0)
               };
          }

          function Export() {
               app.project.renderQueue.items.add(GetCompByName('PLANNING')).outputModule(1).applyTemplate('PNG')
          };

          // Additionnal function for SetDate()
          function FindAndIncMonth(array, dd) {
               for (var index = 0; index < array.length; index++) {
                    var item = array[index];
                    if (item.selected) return index != 11 ? array[index + 1] : array[0]
               }
          }

          // Setup the planning dates
          function SetDate(dd1, dd2) {
               const compPlanning = GetCompByName('PLANNING');
               var day = parseInt(dd1.selection) + 1;
               var day2 = day + 6
               var month = dd2.selection
               var layer = compPlanning.layer(8)
               var textDocument = new TextDocument('Some text');
               layer.property('Source Text').expression = 'text.sourceText.style.setFontSize(70)';
               if (day >= 25) {
                    layer.property('Source Text').expression = 'text.sourceText.style.setFontSize(53)';
                    if (dd2.selection.toString() == 'janvier' || dd2.selection.toString() == 'mars' || dd2.selection.toString() == 'mai' || dd2.selection.toString() == 'juillet' || dd2.selection.toString() == 'août' || dd2.selection.toString() == 'octobre' || dd2.selection.toString() == 'décembre') {
                         if (day > 25) month = FindAndIncMonth(dd2.items, dd2.selection);
                         if (day == 26) {
                              day2 = 1;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 27) {
                              day2 = 2;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 28) {
                              day2 = 3;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 29) {
                              day2 = 4;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 30) {
                              day2 = 5;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 31) {
                              day2 = 6;
                              day = day + ' ' + dd2.selection.toString();
                         }
                    } else {
                         month = FindAndIncMonth(dd2.items);
                         if (day == 25) {
                              day2 = 1;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 26) {
                              day2 = 2;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 27) {
                              day2 = 3;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 28) {
                              day2 = 4;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 29) {
                              day2 = 5;
                              day = day + ' ' + dd2.selection.toString();
                         }
                         if (day == 30) {
                              day2 = 6;
                              day = day + ' ' + dd2.selection.toString();
                         }
                    }
               }
               compPlanning.layer(8).text.sourceText.setValue('Planning du ' + day + ' au ' + day2 + ' ' + month.toString());
          }

          function TimeRemap(layersCollection) {
               for (i in layersCollection) { layersCollection[i].expression = null }
               for (n in activeDays) {
                    var count = 0;
                    var delay = 9 * count;
                    count++;
                    layersCollection[activeDays[n]].expression = 'thisLayer.timeRemap.valueAtTime(time - ' + delay + ')';
               }
          }

          // Handler activation
          for (var i = 0; i < activationPanel.children.length; i++) {
               activationPanel.children[i].addEventListener('mousedown', function (e) {
                    ActivateDay(e.target, e.target.properties.name)
               });
          };

          //Date
          buttonApply.onClick = function () {
               SetDate(ddDays, ddMonths)
          }

          // Clear prog
          buttonClear.onClick = function () {
               Clear();
          };

          // Export prog
          buttonExport.onClick = function () {
               Export();
          }

          // Close script
          buttonClose.addEventListener('mousedown', function () {
               win.close();
          });

          win instanceof Window ? (win.center(), win.show()) : (win.layout.layout(true));
     }
})(this);