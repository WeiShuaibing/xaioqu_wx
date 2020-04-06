<template>
	<view>
		<!-- 顶部数据总览 -->
		<view>
			<!-- 总话题是和创建话题- -->
			<view style="display: flex;">
				<view class="my_card bg-blue">
					<view>
						<view style="width: 60%;text-align: left;display: inline-block;" class="card_text">总评论：</view>
						<view style="width: 40%;text-align: right;display: inline-block;font-size: 52rpx;" class="cuIcon-comment text-white"></view>
					</view>
					<view>
						<view class="card_text"><text  style="line-height: 2.5;">{{baseNum.totalComment}}</text></view>
					</view>
				</view>
				<view class="my_card bg-green" @click="toAddComment">
					<view>
						<view style="width: 60%;text-align: left;display: inline-block;" class="card_text">人气值：</view>
						<view style="width: 40%;text-align: right;display: inline-block;font-size: 52rpx;" class="cuIcon-hot text-white"></view>
					</view>
					<view>
						<view class="card_text"><text  style="line-height: 2.5;">{{baseNum.totalLove}}</text></view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 评论list -->
		<view>
			<view class="cu-list menu-avatar comment solids-top">
					<view class="cu-item" v-for="(item, index) in commentList" :key="index">
						<view class="cu-avatar round">
							<image class="cu-avatar round" :src="item.user_avatar | userAvatarFilter" mode=""></image>
						</view>
						<view class="content">
							<view class="text-grey">{{item.user_name}}</view>
							<view class="text-gray text-content text-df">
								{{item.comment_text}}
							</view>
							<view> <!-- 评论的图片 item.comment_img -->
								<view v-if="item.comment_img" style="width: 100%;">
									<image v-for="(img_item, img_index) in item.comment_img" :key="img_index" style="width: 33%;height: 180rpx;" :src="img_item | commentImgFilter" mode=""></image>
								</view>
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">{{item.create_date | dateFormat}}</view>
								<view>
									<text v-if="commentIsLoved.hasOwnProperty(item.id)" class="cuIcon-appreciate text-red" @click="zan(item)"></text>
									<text v-else class="cuIcon-appreciate" @click="zan(item)"></text>
									<text class="cuIcon-messagefill text-gray margin-left-sm" @click="toAddComment(item)"></text>
								</view>
							</view>
							<!-- 回复start -->
							<view style="display: flex;padding: 10rpx;" class="bg-grey" v-for="(item2, index2) in item.children" :key="index2">
								<view style="border-radius: 50%;width: 64rpx;height: 64rpx;">
									<image style="border-radius: 50%;width: 64rpx;height: 64rpx;" :src="item2.user_avatar | userAvatarFilter"></image>
								</view>
								<view style="margin-left: 25rpx;width: 100%;">
									<view class="text-white">{{item2.user_name}}</view>
									<view class="text-white text-content text-df">
										<text class="text-yellow">@{{item2.parent_user_name}}</text>:{{item2.comment_text}}
									</view>
									<view> <!-- 评论的图片 item.comment_img -->
										<view v-if="item2.comment_img" style="width: 100%;">
											<image v-for="(img_item, img_index) in item2.comment_img" :key="img_index" style="width: 33%;height: 155rpx;" :src="img_item | commentImgFilter" mode=""></image>
										</view>
									</view>
									<view class="margin-top-sm flex justify-between" style="width: 100%;">
										<view class="text-white text-df">{{item2.create_date | dateFormat}}</view>
										<view>
											<text v-if="commentIsLoved[item2.id]" class="cuIcon-appreciate text-red" @click="zan(item2)"></text>
											<text v-else class="cuIcon-appreciate text-white" @click="zan(item2)"></text>
											<text class="cuIcon-messagefill text-white margin-left-sm" @click="toAddComment(item2)"></text>
										</view>
									</view>
								</view>
							</view>
							<!-- 回复end -->
						</view>
					</view>
				</view>
		</view>
		<view @click="getMore" class="text-sm text-gray" style="width: 100%;text-align: center;line-height: 3;">查看更多</view>
		<view style="height: 150rpx;"></view>
		
		<!-- 底部导航 start -->
		<view class="cu-bar tabbar bg-white foot">
				<view class="action text-green" @click="toAddComment(0)">
					<view class="cuIcon-add"></view> 评论
				</view>
				<view class="action text-green" @click="toDianzan">
					<view v-if="!isLoved" class="cuIcon-appreciate"></view>
					<view v-else class="cuIcon-appreciatefill"></view>
					点赞
				</view>
			</view>
		<!-- 底部导航 end -->
	</view>
</template>

<script>
	import BASE_HOST from '../../util/util.js'
	export default {
		data() {
			return {
				topicId: 0,
				isLoved: false,
				commentIsLoved: {},
				pageNum: 1,
				pageSize: 2,
				totalNum: 0,
				commentList: [],
				baseNum: {}
			}
		},
		onLoad(option) {
			this.topicId = option.id
		},
		onShow() {
			this.getPageComment()
			this.getTotalNum()
		},
		filters: {
			dateFormat(value) {
				var d = new Date(value)
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
			},
			userAvatarFilter(value) {
				if (value.substr(0,5)==='https') {
					return value
				} else {
					return BASE_HOST + value
				}
			},
			commentImgFilter(value) {
				return BASE_HOST + value
			}
		},
		methods: {
			getMore() {
				if((this.pageNum) * this.pageSize >= this.baseNum.parentComment ) {
					uni.showToast({
						title: '没有更多了！',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				
				this.pageNum = this.pageNum + 1
				var _this = this
				uni.request({
					url:BASE_HOST + 'comment/getPageComment',
					method:'GET',
					data:{
						pageNum: _this.pageNum,
						pageSize: _this.pageSize,
						topicId: _this.topicId
					},
					success(res) {
						var list = res.data.data.data
						list.forEach((item, index) => {
							if(item.comment_img !== '') {
								item.comment_img = item.comment_img.split(',')
							}
							item.children.forEach((item2, index2) => {
								if(item2.comment_img !== '') {
									item2.comment_img = item2.comment_img.split(',')
								}
							})
						})
						console.log('000')
						console.log(list)
						// _this.commentList.push(list)
						_this.commentList = _this.commentList.concat(list)
					}
				})
			},
			getTotalNum() {
				var _this = this
				uni.request({
					url:BASE_HOST + 'comment/getTotalOfTopic',
					method:'GET',
					data:{
						topicId: _this.topicId
					},
					success(res) {
						_this.baseNum = res.data.data
					}
				})
			},
			zan(row) {
				var _this = this
				if(this.commentIsLoved[row.id]) {
					// 已点赞 
					uni.showToast({
						title: '已点赞！',
						duration: 2000,
						icon: 'none'
					})
				} else {
					uni.request({
						url:BASE_HOST + 'comment/love',
						method:'GET',
						data:{
							id: row.id
						},
						success(res) {
							_this.$set(_this.commentIsLoved,row.id, true)
						}
					})
				}
				console.log(this.commentIsLoved)
			},
			getPageComment(){
				var _this = this
				uni.request({
					url:BASE_HOST + 'comment/getPageComment',
					method:'GET',
					data:{
						pageNum: _this.pageNum,
						pageSize: _this.pageSize,
						topicId: _this.topicId
					},
					success(res) {
						_this.commentList = res.data.data.data
						_this.commentList.forEach((item, index) => {
							if(item.comment_img !== '') {
								item.comment_img = item.comment_img.split(',')
							}
							item.children.forEach((item2, index2) => {
								if(item2.comment_img !== '') {
									item2.comment_img = item2.comment_img.split(',')
								}
							})
						})
						console.log(_this.commentList)
					}
				})
			},
			toDianzan() {
				if(this.isLoved){
					uni.showToast({
						title: '已赞过',
						duration: 2000
					})
					return
				}
				var _this = this
				uni.request({
					url: BASE_HOST + 'topic/love',
					method:'GET',
					data:{
						id: _this.topicId
					},
					success(res) {
						_this.isLoved = true
						uni.showToast({
							title: '点赞成功',
							duration: 2000
						})
					}
				})
			},
			toAddComment(com) {
				if(com === 0) {
					uni.navigateTo({
						url:'./addComment?topicId=' + this.topicId + '&commentId=' + 0
					})
				} else {
					uni.navigateTo({
						url:'./addComment?topicId=' + this.topicId + '&commentId=' + com.id
					})
				}
				
			}
		}
	}
</script>

<style>
.my_card{
	flex: 1;

	padding: 30rpx;
	border-radius: 12rpx;
	width: 45%;
	height: 180rpx;
	margin: 0 2.5% 40rpx;
	background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 1;
}
.card_text{
	font-size: 32rpx;
}
.card_text:first-letter{
	font-size: 36rpx;
}
</style>
