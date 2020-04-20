<template>
	<view style="padding: 20rpx;">
		<!--文字描述维修信息-->
		<view>
			<view class="cu-form-group margin-top">
				<textarea maxlength="500" v-model="repairInfo.repairText" placeholder="您要报修的问题描述！！！"></textarea>
			</view>
		</view>
		
		<!--图片信息-->
		<view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<9">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
		</view>
		
		<!--保存按钮-->
		<view class="padding-xl">
			<button @click="save" class="cu-btn block bg-blue margin-tb-sm lg">
				<text class="cuIconfont-spin" :class="loading_class"></text>
				提交
			</button>
		</view>
	</view>
</template>

<script>
import BASE_HOST from '../../util/util.js'
	export default {
		data() {
			return {
				loading_class: '',
				repairInfo: {
					repairText: '',
					repairImgs: ''
				},
				imgList: [],
				upImgList: []
			}
		},
		methods: {
			async save() {
				var _this = this
				
				// 判断数据是否非空
				if (this.imgList.length == 0 || this.repairInfo.repairText === '') {
					uni.showToast({
						title: '请完善内容哦！',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				
				this.loading_class = 'cuIcon-loading2'
				// 上传图片
					var i=0
					await this.imgList.forEach((item, index) => {
						uni.uploadFile({
							url: BASE_HOST + 'file/upload',
							filePath: item,
							name: 'file',
							success: (res) => {
								var r = JSON.parse(res.data)
								_this.upImgList.push(r.data.path)
							},
							fail(err) {
								uni.showToast({
									title: '上传失败！',
									duration: 2000,
									icon: 'none'
								})
							},
							complete() {
								i = i+1
								if (i===_this.imgList.length){
									// 将评论信息上传到服务器=========================================================
									uni.request({
										url: BASE_HOST + 'repair/add',
										method: 'POST',
										data: {
											repairText: _this.repairInfo.repairText,
											repairImgs: _this.upImgList.join(',')
										},
										header: {
											XiaoQuToken: uni.getStorageSync('local_userinfo').token,
										},
										success: (res) => {
											if (res.data.code === 20002) {
												uni.showToast({
													title: res.data.msg,
													duration: 2000,
													icon: 'none'
												})
												_this.repairInfo.repairText = ''
												_this.upImgList = ''
												_this.imgList = ''
											} else {
												_this.repairInfo.repairText = ''
												_this.upImgList = ''
												_this.imgList = ''
												uni.navigateBack({
													delta: 1
												});
												uni.showToast({
												    title: '报修成功',
												    duration: 2000
												});
											}
										},
										fail(err) {
											uni.showToast({
												title: '发布失败！',
												duration: 2000,
												icon: 'none'
											})
										}
									});
								}
							}
						});
					})
					this.loading_class = ''
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认4
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
				console.log(this.imgList)
			},
			DelImg(e) {
				uni.showModal({
					title: '亲',
					content: '确定删除此图片吗？',
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
