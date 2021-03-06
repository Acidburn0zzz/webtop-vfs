/* 
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
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, see http://www.gnu.org/licenses or write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA.
 *
 * You can contact Sonicle S.r.l. at email address sonicle[at]sonicle[dot]com
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * Sonicle logo and Sonicle copyright notice. If the display of the logo is not
 * reasonably feasible for technical reasons, the Appropriate Legal Notices must
 * display the words "Copyright (C) 2014 Sonicle S.r.l.".
 */
package com.sonicle.webtop.vfs;

/**
 *
 * @author malbinola
 */
public class VfsSettings {
	
	/**
	 * [user+domain+system]
	 * [int]
	 * Maximum file size for internal uploads
	 */
	public static final String UPLOAD_PRIVATE_MAXFILESIZE = "upload.private.maxfilesize";
	
	/**
	 * [user+domain+system]
	 * [int]
	 * Maximum file size for public uploads
	 */
	public static final String UPLOAD_PUBLIC_MAXFILESIZE = "upload.public.maxfilesize";
	
	/**
	 * [domain+system]
	 * [string][templatable]
	 * 
	 */
	public static final String STORE_FILE_BASEPATH = "store.file.basepath";
	public static class StoreFileBasepathTemplateValues {
		public String SERVICE_HOME;
		public String SERVICE_ID;
		public String DOMAIN_ID;
	}
	
	/**
	 * [domain+system]
	 * [string][templatable]
	 * 
	 */
	public static final String MYDOCUMENTS_URI = "mydocuments.uri";
	public static class MyDocumentsUriTemplateValues {
		public String SERVICE_HOME;
		public String SERVICE_ID;
		public String DOMAIN_ID;
		public String USER_ID;
	}
	
	/**
	 * [domain+system]
	 * [int]
	 * Default expiration days of upload links
	 */
	public static final String LINK_UPLOAD_EXPIRATION = "link.upload.expiration";
	
	/**
	 * [domain+system]
	 * [int]
	 * Default expiration days of download links
	 */
	public static final String LINK_DOWNLOAD_EXPIRATION = "link.download.expiration";
	
	/**
	 * [user]
	 * [boolean]
	 * True to display hidden files and dotfiles (file's name start with .) in results
	 */
	public static final String HIDDENFILES_SHOW = "hiddenfiles.show";
	
	/**
	 * [domain+system]
	 * [string]
	 * Nextcloud default host
	 */
	public static final String NEXTCLOUD_DEFAULT_HOST = "nextcloud.default.host";
	
	/**
	 * [domain+system]
	 * [string]
	 * Nextcloud default path
	 */
	public static final String NEXTCLOUD_DEFAULT_PATH = "nextcloud.default.path";
}
