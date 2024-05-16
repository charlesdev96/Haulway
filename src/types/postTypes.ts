export interface User {
	_id?: string | null;
	fullName?: string | null;
	profilePic?: string | null;
	numOfFollowers?: number;
	numOfFollowings?: number;
}

export interface Comment {
	_id?: string | null;
	comment?: string | null;
	post?: string | null;
	commentedBy?: User | null;
	numOfReplies?: number;
	replies?: Reply[];
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface Reply {
	_id?: string | null;
	reply?: string | null;
	comment?: string | null;
	replier?: User | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface Post {
	_id?: string | null;
	content?: string[] | null;
	desc?: string | null;
	postedBy?: User | null;
	views?: number;
	numOfLikes?: number;
	numOfComments?: number;
	comments?: Comment[];
	createdAt?: string | null;
	updatedAt?: string | null;
}
