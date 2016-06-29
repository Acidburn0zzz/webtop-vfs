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
package com.sonicle.webtop.vfs.dal;

import com.sonicle.webtop.core.dal.BaseDAO;
import com.sonicle.webtop.core.dal.DAOException;
import com.sonicle.webtop.core.sdk.UserProfile;
import com.sonicle.webtop.vfs.bol.OSharingLink;
import static com.sonicle.webtop.vfs.jooq.tables.SharingLinks.SHARING_LINKS;
import com.sonicle.webtop.vfs.jooq.tables.records.SharingLinksRecord;
import java.sql.Connection;
import java.util.List;
import org.jooq.DSLContext;

/**
 *
 * @author malbinola
 */
public class SharingLinkDAO extends BaseDAO {
	private final static SharingLinkDAO INSTANCE = new SharingLinkDAO();
	public static SharingLinkDAO getInstance() {
		return INSTANCE;
	}
	
	public OSharingLink selectById(Connection con, String linkId) throws DAOException {
		DSLContext dsl = getDSL(con);
		return dsl
			.select()
			.from(SHARING_LINKS)
			.where(
					SHARING_LINKS.SHARING_LINK_ID.equal(linkId)
			)
			.fetchOneInto(OSharingLink.class);
	}
	
	public OSharingLink selectByIdType(Connection con, String linkId, String linkType) throws DAOException {
		DSLContext dsl = getDSL(con);
		return dsl
			.select()
			.from(SHARING_LINKS)
			.where(
					SHARING_LINKS.SHARING_LINK_ID.equal(linkId)
					.and(SHARING_LINKS.LINK_TYPE.equal(linkType))
			)
			.fetchOneInto(OSharingLink.class);
	}
	
	public List<OSharingLink> selectByTypeProfileStorePath(Connection con, String linkType, UserProfile.Id profileId, int storeId, String filePathStartsWith) throws DAOException {
		DSLContext dsl = getDSL(con);
		return dsl
			.select()
			.from(SHARING_LINKS)
			.where(
					SHARING_LINKS.DOMAIN_ID.equal(profileId.getDomain())
					.and(SHARING_LINKS.USER_ID.equal(profileId.getUser())
					.and(SHARING_LINKS.LINK_TYPE.equal(linkType)
					.and(SHARING_LINKS.STORE_ID.equal(storeId)
					.and(SHARING_LINKS.FILE_PATH.startsWith(filePathStartsWith)))))
					
			)
			.fetchInto(OSharingLink.class);
	}
	
	public int insert(Connection con, OSharingLink item) throws DAOException {
		DSLContext dsl = getDSL(con);
		SharingLinksRecord record = dsl.newRecord(SHARING_LINKS, item);
		return dsl
			.insertInto(SHARING_LINKS)
			.set(record)
			.execute();
	}
	
	public int deleteByIdType(Connection con, String linkId, String linkType) throws DAOException {
		DSLContext dsl = getDSL(con);
		return dsl
			.delete(SHARING_LINKS)
			.where(
					SHARING_LINKS.SHARING_LINK_ID.equal(linkId)
					.and(SHARING_LINKS.LINK_TYPE.equal(linkType))
			)
			.execute();
	}
	
	public int deleteByProfile(Connection con, UserProfile.Id profileId) throws DAOException {
		DSLContext dsl = getDSL(con);
		return dsl
			.delete(SHARING_LINKS)
			.where(
					SHARING_LINKS.DOMAIN_ID.equal(profileId.getDomain())
					.and(SHARING_LINKS.USER_ID.equal(profileId.getUser()))
			)
			.execute();
	}
}
