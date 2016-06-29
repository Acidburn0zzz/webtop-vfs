/*
 * webtop-vfs is a WebTop Service developed by Sonicle S.r.l.
 * Copyright (C) 2014 Sonicle S.r.l.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by
 * the Free Software Foundation with the addition of the following permission
 * added to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED
 * WORK IN WHICH THE COPYRIGHT IS OWNED BY SONICLE, SONICLE DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, see http://www.gnu.org/licenses or write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA.
 *
 * You can contact Sonicle S.r.l. at email address sonicle@sonicle.com
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Powered by Sonicle WebTop" logo. If the display of the logo is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Powered by Sonicle WebTop".
 */
Ext.define('Sonicle.webtop.vfs.Service', {
	extend: 'WT.sdk.Service',
	requires: [
		'Sonicle.grid.column.Icon',
		'Sonicle.grid.column.Bytes',
		'Sonicle.grid.column.Link',
		'WT.ux.data.EmptyModel',
		'WT.ux.data.SimpleModel',
		'Sonicle.webtop.vfs.model.StoreNode',
		'Sonicle.webtop.vfs.model.GridFile'
	],
	mixins: [
		//'WT.mixin.FoldersTree'
	],
	
	needsReload: true,
	
	init: function() {
		var me = this, ies, iitems = [];
		
		me.initActions();
		me.initCxm();
		
		me.on('activate', me.onActivate, me);
		
		me.setToolbar(Ext.create({
			xtype: 'toolbar',
			items: [
				'-',
				{
					xtype: 'button',
					text: 'Ftp',
					handler: function() {
						me.setupStoreFtp();
					}
				},
				{
					xtype: 'button',
					text: 'Dropbox',
					handler: function() {
						me.setupStoreDropbox();
					}
				},
				{
					xtype: 'button',
					text: 'GoogleDrive',
					handler: function() {
						me.setupStoreGoogleDrive();
					}
				},
				{
					xtype: 'button',
					text: 'Download',
					handler: function() {
						me.wizardDownloadLink();
					}
				},
				//me.getAction('deleteTask2'),
				'->'
				/*
				me.addRef('txtsearch', Ext.create({
					xtype: 'textfield',
					width: 200,
					triggers: {
						search: {
							cls: Ext.baseCSSPrefix + 'form-search-trigger',
							handler: function(s) {
								me.queryTasks(s.getValue());
							}
						}
					},
					listeners: {
						specialkey: function(s, e) {
							if(e.getKey() === e.ENTER) me.queryTasks(s.getValue());
						}
					}
				}))
				*/
			]
		}));
		
		me.setToolComponent(Ext.create({
			xtype: 'panel',
			layout: 'border',
			referenceHolder: true,
			title: me.getName(),
			items: [{
				region: 'center',
				xtype: 'treepanel',
				reference: 'storestree',
				border: false,
				useArrows: true,
				rootVisible: false,
				store: {
					autoLoad: true,
					autoSync: true,
					model: 'Sonicle.webtop.vfs.model.StoreNode',
					proxy: WTF.apiProxy(me.ID, 'ManageStoresTree', 'children', {
						writer: {
							allowSingle: false // Always wraps records into an array
						}
					}),
					root: {
						id: 'root',
						expanded: true
					},
					listeners: {
						write: function(s,op) {
							//me.reloadTasks();
						}
					}
				},
				hideHeaders: true,
				listeners: {
					checkchange: function(n, ck) {
						//me.showHideFolder(n, ck);
					},
					itemclick: function(s, rec, itm, i, e) {
						if(rec.get('_type') === 'file') {
							me.reloadFiles(rec.getId());
						}
					},
					itemcontextmenu: function(s, rec, itm, i, e) {
						/*
						if(rec.get('_type') === 'root') {
							WT.showContextMenu(e, me.getRef('cxmRootFolder'), {folder: rec});
						} else {
							WT.showContextMenu(e, me.getRef('cxmFolder'), {folder: rec});
						}
						*/
					}
				}
			}]
		}));
		
		me.setMainComponent(Ext.create({
			xtype: 'container',
			layout: 'border',
			referenceHolder: true,
			viewModel: {
				formulas: {
					/*selectedTask: {
						bind: {bindTo: '{gptasks.selection}'},
						get: function (val) {
							return val;
						}
					},
					selectedTaskPercentage: {
						bind: {bindTo: '{selectedTask.percentage}'},
						get: function (val) {
							return Ext.isEmpty(val) ? '' : val + '%';
						}
					},
					selectedTaskReminder: {
						bind: {bindTo: '{selectedTask.reminderDate}'},
						get: function (val) {
							return !Ext.isDate(val) ? WT.res('word.none.male') : Ext.Date.format(val, WT.getShortDateTimeFmt());
						}
					}
					*/
				}
			},
			items: [{
				region: 'center',
				xtype: 'grid',
				reference: 'gpfiles',
				stateful: true,
				stateId: me.buildStateId('gpfiles'),
				store: {
					model: 'Sonicle.webtop.vfs.model.GridFile',
					proxy: WTF.apiProxy(me.ID, 'ManageGridFiles', 'files', {
						extraParams: {
							fileId: null
						}
					})
				},
				/*
				viewConfig: {
					getRowClass: function (rec, indx) {
						if (rec.get('status') === 'completed')
							return 'wttasks-row-completed';
						if (Ext.isDate(rec.get('dueDate')) && Sonicle.Date.compare(rec.get('dueDate'),new Date(),false)>0 )
							return 'wttasks-row-expired';
						return '';
					}
				},
				*/
				selModel: {
					type: 'checkboxmodel',
					mode : 'MULTI'
				},
				columns: [{
					xtype: 'soiconcolumn',
					dataIndex: 'type',
					header: WTF.headerWithGlyphIcon('fa fa-file-o'),
					iconField: function(v,rec) {
						return (v === 'folder') ? 'wt-ftype-folder-xs' : WTF.fileTypeCssIconCls(rec.get('ext'), 'xs');
					},
					iconSize: WTU.imgSizeToPx('xs'),
					width: 40
				}, {
					xtype: 'solinkcolumn',
					dataIndex: 'name',
					header: me.res('gpfiles.name.lbl'),
					flex: 1,
					listeners: {
						linkclick: function(s,idx,rec) {
							if(rec.get('type') === 'folder') me.reloadFiles(rec.get('fileId'));
						}
					}
				}, {
					xtype: 'sobytescolumn',
					dataIndex: 'size',
					header: me.res('gpfiles.size.lbl'),
					width: 100
				}, {
					dataIndex: 'lastModified',
					header: me.res('gpfiles.lastModified.lbl'),
					xtype: 'datecolumn',
					format: WT.getShortDateFmt() + ' ' + WT.getShortTimeFmt(),
					width: 140
				}, {
					xtype: 'soiconcolumn',
					dataIndex: 'dLink',
					header: WTF.headerWithGlyphIcon('fa fa-cloud-download'),
					iconField: function(v) {
						return Ext.isEmpty(v) ? '' : 'wtvfs-icon-downloadLink-xs';
					},
					iconSize: WTU.imgSizeToPx('xs'),
					width: 40
				}, {
					xtype: 'soiconcolumn',
					dataIndex: 'uLink',
					header: WTF.headerWithGlyphIcon('fa fa-cloud-upload'),
					iconField: function(v) {
						return Ext.isEmpty(v) ? '' : 'wtvfs-icon-uploadLink-xs';
					},
					iconSize: WTU.imgSizeToPx('xs'),
					width: 40
				}],
				listeners: {
					selectionchange: function() {
						me.updateCxmGridFile();
					},
					rowdblclick: function(s, rec) {
						//var er = me.toRightsObj(rec.get('_erights'));
						//me.showTask(er.UPDATE, rec.get('taskId'));
					},
					rowcontextmenu: function(s, rec, itm, i, e) {
						s.getSelectionModel().select(rec);
						WT.showContextMenu(e, me.getRef('cxmGridFile'), {
							file: rec,
							files: s.getSelection()
						});
					}
				}
			}, {
				region: 'east',
				xtype: 'wtform',
				stateful: true,
				//stateId: me.buildStateId('gptaskspreview'),
				split: true,
				collapsible: true,
				title: WT.res('word.preview'),
				width: 200,
				defaults: {
					labelAlign: 'top',
					readOnly: true,
					anchor: '100%'
				},
				items: []
			}]
		}));
	},
	
	gpFiles: function() {
		return this.getMainComponent().lookupReference('gpfiles');
	},
	
	initActions: function() {
		var me = this;
		/*
		me.addAction('new', 'newTask', {
			handler: function() {
				me.getAction('addTask').execute();
			}
		});
		me.addAction('editSharing', {
			text: WT.res('sharing.tit'),
			iconCls: WTF.cssIconCls(WT.XID, 'sharing', 'xs'),
			handler: function() {
				var node = me.getSelectedNode(me.getRef('folderstree'));
				if(node) me.editShare(node.getId());
			}
		});
		me.addAction('addCategory', {
			handler: function() {
				var node = me.getSelectedFolder(me.getRef('folderstree'));
				if(node) me.addCategory(node.get('_domainId'), node.get('_userId'));
			}
		});
		me.addAction('editCategory', {
			handler: function() {
				var node = me.getSelectedFolder(me.getRef('folderstree'));
				if(node) me.editCategory(node.get('_catId'));
			}
		});
		me.addAction('deleteCategory', {
			handler: function() {
				var node = me.getSelectedFolder(me.getRef('folderstree'));
				if(node) me.confirmDeleteCategory(node);
			}
		});
		me.addAction('viewAllFolders', {
			iconCls: 'wt-icon-select-all-xs',
			handler: function() {
				me.showHideAllFolders(me.getSelectedRootFolder(me.getRef('folderstree')), true);
			}
		});
		me.addAction('viewNoneFolders', {
			iconCls: 'wt-icon-select-none-xs',
			handler: function() {
				me.showHideAllFolders(me.getSelectedRootFolder(me.getRef('folderstree')), false);
			}
		});
		me.addAction('showTask', {
			text: WT.res('act-open.lbl'),
			handler: function() {
				var rec = me.getSelectedTask(), er;
				if(rec) {
					er = me.toRightsObj(rec.get('_erights'));
					me.showTask(er.UPDATE, rec.get('taskId'));
				}
			}
		});
		me.addAction('addTask', {
			handler: function() {
				var node = me.getSelectedFolder(me.getRef('folderstree'));
				if(node) me.addTask(node.get('_pid'), node.get('_catId'));
			}
		});
		
		me.addAction('copyTask', {
			handler: function() {
				me.moveTasksSel(true, me.getSelectedTasks());
			}
		});
		me.addAction('moveTask', {
			handler: function() {
				me.moveTasksSel(false, me.getSelectedTasks());
			}
		});
		me.addAction('printTask', {
			text: WT.res('act-print.lbl'),
			iconCls: 'wt-icon-print-xs',
			handler: function() {
				var sel = me.getSelectedTasks();
				if(sel.length > 0) me.printSelTasks(sel);
			}
		});
		me.addAction('print', {
			text: null,
			tooltip: WT.res('act-print.lbl'),
			iconCls: 'wt-icon-print-xs',
			handler: function() {
				me.getAction('printTask').execute();
			}
		});
		me.addAction('deleteTask2', {
			text: null,
			tooltip: WT.res('act-delete.tip'),
			iconCls: 'wt-icon-delete-xs',
			handler: function() {
				me.getAction('deleteTask').execute();
			}
		});
		me.addAction('addTask2', {
			text: null,
			tooltip: me.res('act-addTask.lbl'),
			iconCls: me.cssIconCls('addTask', 'xs'),
			handler: function() {
				me.getAction('addTask').execute();
			}
		});
		*/
		
		
		me.addAction('openFile', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.openSelFile(sel);
			}
		});
		me.addAction('downloadFile', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.downloadSelFile(sel);
			}
		});
		me.addAction('renameFile', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.renameSelFile(sel);
			}
		});
		me.addAction('deleteFile', {
			handler: function() {
				var sel = me.getSelectedFiles();
				if(sel.length > 0) me.deleteSelFiles(sel);
			}
		});
		me.addAction('addDownloadLink', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.addSelLink('d', sel);
			}
		});
		me.addAction('deleteDownloadLink', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.deleteSelLink('d', sel);
			}
		});
		me.addAction('addUploadLink', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.addSelLink('u', sel);
			}
		});
		me.addAction('deleteUploadLink', {
			handler: function() {
				var sel = me.getSelectedFile();
				if(sel) me.deleteSelLink('u', sel);
			}
		});
	},
	
	
	updateCxmGridFile: function() {
		var me = this;
		me.updateDisabled('openFile');
		me.updateDisabled('downloadFile');
		me.updateDisabled('renameFile');
		me.updateDisabled('addDownloadLink');
		me.updateDisabled('deleteDownloadLink');
		//me.updateDisabled('sendDownloadLink');
		me.updateDisabled('addUploadLink');
		me.updateDisabled('deleteUploadLink');
		//me.updateDisabled('sendUploadLink');
	},
	
	openSelFile: function(sel) {
		
	},
	
	downloadSelFile: function(sel) {
		
	},
	
	renameSelFile: function(sel) {
		var me = this;
		
		WT.prompt(me.res('gpfiles.name.lbl'), {
			title: me.res('act-renameFile.lbl'),
			value: sel.get('name'),
			fn: function(bid, name) {
				if(bid === 'ok') {
					if(name !== sel.get('name')) {
						me.renameFile(sel.get('fileId'), name, {
							callback: function(success) {
								if(success) sel.set('name', name);
							}
						});
					}
				}
			}
		});
	},
	
	deleteSelFiles: function(sel) {
		var me = this,
			sto = me.gpFiles().getStore(),
			ids = me.selectionIds(sel),
			msg;
		
		if(sel.length === 1) {
			msg = me.res('gpfiles.confirm.delete', Ext.String.ellipsis(sel[0].get('name'), 40));
		} else {
			msg = me.res('gpfiles.confirm.delete.selection');
		}
		WT.confirm(msg, function(bid) {
			if(bid === 'yes') {
				me.deleteFiles(ids, {
					callback: function(success) {
						if(success) sto.remove(sel);
					}
				});
			}
		});
	},
	
	addSelLink: function(type, sel) {
		var me = this;
		me.setupLink(type, sel.get('fileId'), {
			callback: function(success) {
				if(success) me.reloadFiles();
			}
		});
	},
	
	deleteSelLink: function(type, sel) {
		var me = this,
				field = type+'Link',
				fileId = sel.get(field);
		WT.confirm(me.res('link.confirm.delete'), function(bid) {
			if(bid === 'yes') {
				me.deleteLink(type, fileId, {
					callback: function(success) {
						if(success) {
							sel.set(field, null);
							me.updateCxmGridFile();
							//me.reloadFiles();
						}
					}
				});
			}
		});
	},
	
	sendSelLink: function(type, sel) {
		
	},
	
	openfile: function(id) {
		
	},
	
	downloadFile: function(id) {
		
	},
	
	renameFile: function(fileId, name, opts) {
		opts = opts || {};
		var me = this;
		WT.ajaxReq(me.ID, 'ManageFiles', {
			params: {
				crud: 'rename',
				id: fileId,
				name: name
			},
			callback: function(success, json) {
				Ext.callback(opts.callback, opts.scope || me, [success, json]);
			}
		});
	},
	
	deleteFiles: function(ids, opts) {
		opts = opts || {};
		var me = this;
		WT.ajaxReq(me.ID, 'ManageFiles', {
			params: {
				crud: 'delete',
				ids: WTU.arrayAsParam(ids)
			},
			callback: function(success, json) {
				Ext.callback(opts.callback, opts.scope || me, [success, json]);
			}
		});
	},
	
	setupLink: function(type, fileId, opts) {
		var me = this, vwc;
		
		if(type === 'd') {
			vwc = me.wizardDownloadLink(fileId);
		} else if(type === 'u') {
			vwc = me.wizardUploadLink(fileId);
		}
		vwc.getView().on('viewclose', function(s) {
			var result = s.getVM().get('result');
			Ext.callback(opts.callback, opts.scope || me, [result !== null, result]);
		});
		vwc.show();
	},
	
	deleteLink: function(type, linkId, opts) {
		opts = opts || {};
		var me = this, act;
		
		if(type === 'd') {
			act = 'ManageDownloadLink';
		} else if(type === 'u') {
			act = 'ManageUploadLink';
		}
		WT.ajaxReq(me.ID, act, {
			params: {
				crud: 'delete',
				id: linkId
			},
			callback: function(success, json) {
				Ext.callback(opts.callback, opts.scope || me, [success, json]);
			}
		});
	},
	
	initCxm: function() {
		var me = this;
		/*
		me.addRef('cxmRootFolder', Ext.create({
			xtype: 'menu',
			items: [
				me.getAction('addCategory'),
				'-',
				me.getAction('editSharing')
				//TODO: azioni altri servizi?
			],
			listeners: {
				beforeshow: function(s) {
					var rec = s.menuData.folder,
							rr = me.toRightsObj(rec.get('_rrights'));
					me.getAction('addCategory').setDisabled(!rr.MANAGE);
					me.getAction('editSharing').setDisabled(!rr.MANAGE);
				}
			}
		}));
		
		me.addRef('cxmFolder', Ext.create({
			xtype: 'menu',
			items: [
				me.getAction('editCategory'),
				me.getAction('deleteCategory'),
				me.getAction('addCategory'),
				'-',
				me.getAction('editSharing'),
				'-',
				me.getAction('viewAllFolders'),
				me.getAction('viewNoneFolders'),
				'-',
				me.getAction('addTask')
				//TODO: azioni altri servizi?
			],
			listeners: {
				beforeshow: function(s) {
					var rec = s.menuData.folder,
							rr = me.toRightsObj(rec.get('_rrights')),
							fr = me.toRightsObj(rec.get('_frights')),
							er = me.toRightsObj(rec.get('_erights'));
					me.getAction('editCategory').setDisabled(!fr.UPDATE);
					me.getAction('deleteCategory').setDisabled(!fr.DELETE || rec.get('_builtIn'));
					me.getAction('addCategory').setDisabled(!rr.MANAGE);
					me.getAction('editSharing').setDisabled(!rr.MANAGE);
					me.getAction('addTask').setDisabled(!er.CREATE);
				}
			}
		}));
		*/
		me.addRef('cxmGridFile', Ext.create({
			xtype: 'menu',
			items: [
				me.getAction('openFile'),
				me.getAction('downloadFile'),
				'-',
				me.getAction('renameFile'),
				me.getAction('deleteFile'),
				'-',
				me.getAction('addDownloadLink'),
				me.getAction('deleteDownloadLink'),
				'-',
				me.getAction('addUploadLink'),
				me.getAction('deleteUploadLink')
			]
		}));
	},
	
	onActivate: function() {
		/*
		var me = this,
				gp = me.gpTasks();
		
		if(me.needsReload) {
			me.needsReload = false;
			me.reloadTasks();
		}
		
		me.updateDisabled('showTask');
		me.updateDisabled('printTask');
		me.updateDisabled('copyTask');
		me.updateDisabled('moveTask');
		me.updateDisabled('deleteTask');
		*/
	},
	
	reloadFiles: function(fileId) {
		var me = this, sto, pars = {};
		
		if(me.isActive()) {
			sto = me.gpFiles().getStore();
			if(fileId !== undefined) Ext.apply(pars, {fileId: fileId});
			WTU.loadWithExtraParams(sto, pars);
		} else {
			me.needsReload = true;
		}
	},
	
	getSelectedFile: function(forceSingle) {
		if(forceSingle === undefined) forceSingle = true;
		var sel = this.getSelectedFiles();
		if(forceSingle && sel.length !== 1) return null;
		return (sel.length > 0) ? sel[0] : null;
	},
	
	getSelectedFiles: function() {
		return this.gpFiles().getSelection();
	},
	
	setupStoreFtp: function() {
		var me = this,
				vwc = WT.createView(me.ID, 'view.FtpWiz', {
					viewCfg: {
						//categoryId: categoryId
					}
				});
		
		vwc.getView().on('dosuccess', function() {
			//me.reloadContacts();
		});
		vwc.show();
	},
	
	setupStoreDropbox: function() {
		var me = this,
				vwc = WT.createView(me.ID, 'view.DropboxWiz', {
					viewCfg: {
						//categoryId: categoryId
					}
				});
		
		vwc.getView().on('dosuccess', function() {
			//me.reloadContacts();
		});
		vwc.show();
	},
	
	setupStoreGoogleDrive: function() {
		var me = this,
				vwc = WT.createView(me.ID, 'view.GooDriveWiz', {
					viewCfg: {
						//categoryId: categoryId
					}
				});
		
		vwc.getView().on('dosuccess', function() {
			//me.reloadContacts();
		});
		vwc.show();
	},
	
	wizardDownloadLink: function(fileId) {
		var me = this,
			vwc = WT.createView(me.ID, 'view.DownloadLinkWiz', {
				viewCfg: {
					fileId: fileId
				}
			});
		return vwc;
	},
	
	wizardUploadLink: function(fileId) {
		var me = this,
			vwc = WT.createView(me.ID, 'view.UploadLinkWiz', {
				viewCfg: {
					fileId: fileId
				}
			});
		return vwc;
	},
	
	/**
	 * @private
	 */
	updateDisabled: function(action) {
		var me = this,
				dis = me.isDisabled(action);
		me.setActionDisabled(action, dis);
	},
	
	/**
	 * @private
	 */
	isDisabled: function(action) {
		var me = this, sel;
		switch(action) {
			case 'openFile':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return false;
				} else {
					return true;
				}
			case 'downloadFile':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return false;
				} else {
					return true;
				}
			case 'renameFile':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return false;
				} else {
					return true;
				}
			case 'addDownloadLink':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return !Ext.isEmpty(sel[0].get('dLink'));
				} else {
					return true;
				}
			case 'deleteDownloadLink':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return Ext.isEmpty(sel[0].get('dLink'));
				} else {
					return true;
				}
			case 'addUploadLink':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return (sel[0].get('type') !== 'folder') ? true : !Ext.isEmpty(sel[0].get('uLink'));
				} else {
					return true;
				}
			case 'deleteUploadLink':
				sel = me.getSelectedFiles();
				if(sel.length === 1) {
					return Ext.isEmpty(sel[0].get('uLink'));
				} else {
					return true;
				}	
		}
	}
});
