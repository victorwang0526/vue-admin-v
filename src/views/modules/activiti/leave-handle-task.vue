<template>
    <el-dialog
        :visible.sync="visible"
        :title="!dataForm.id ? $t('add') : $t('manage')"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
            ref="dataForm"
            :model="dataForm"
            :rules="dataRule"
            :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'"
            @keyup.enter.native="dataFormSubmitHandle()">
            <el-form-item
                :label="$t('process.instanceId')"
                prop="instanceId"
                hidden="true">
                <el-input
                    v-model="dataForm.instanceId"
                    :placeholder="$t('process.instanceId')"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.leaveDays')"
                prop="leaveDays">
                <el-input
                    v-model="dataForm.leaveDays"
                    :disabled="!!dataForm.id"
                    :placeholder="$t('leave.leaveDays')"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.beginDate')"
                prop="beginDate">
                <el-input
                    v-model="dataForm.beginDate"
                    :disabled="!!dataForm.id"
                    :placeholder="$t('leave.beginDate')"
                    type="date"
                    value-format="yyyy-MM-dd"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.endDate')"
                prop="endDate">
                <el-input
                    v-model="dataForm.endDate"
                    :disabled="!!dataForm.id"
                    :placeholder="$t('leave.endDate')"
                    type="date"
                    value-format="yyyy-MM-dd"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.leaveReason')"
                prop="leaveReason">
                <el-input
                    v-model="dataForm.leaveReason"
                    :disabled="!!dataForm.id"
                    :placeholder="$t('leave.leaveReason')"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.handle')"
                prop="handle">
                <el-select
                    v-model="dataForm.handle"
                    :placeholder="$t('leave.handle')"
                    style="width:100%"
                    @change="handleChange()">
                    <el-option
                        v-for="item in handleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="checkVisible"
                :label="$t('leave.comment')"
                prop="comment">
                <el-input
                    v-model="dataForm.comment"
                    :placeholder="$t('leave.comment')"
                    type="textarea"/>
            </el-form-item>
            <el-form-item
                v-if="rollbackVisible"
                :label="$t('leave.rollback')">
                <el-select
                    v-model="activityId"
                    :placeholder="$t('leave.rollback')"
                    style="width:100%">
                    <el-option
                        v-for="item in options"
                        :key="item.activityId"
                        :label="item.activtyName"
                        :value="item.activityId"/>
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="entrustVisible"
                :label="$t('leave.rollback')">
                <el-input
                    v-model="dataForm.entrustUserName"
                    class="input-with-select">
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="selectUserInfo()"/>
                </el-input>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button
                type="danger"
                @click="cancelHandle()">
                {{ $t('cancel') }}
            </el-button>
            <el-button
                type="primary"
                @click="commitHandle()">
                {{ $t('confirm') }}
            </el-button>
        </template>
        <select-user
            v-if="selectUserVisible"
            ref="selectUser"/>
    </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce';
import qs from 'qs';
import selectUser from './select-user';
export default {
    components: {
        selectUser
    },
    data() {
        return {
            visible: false,
            innerVisible: false,
            checkVisible: false,
            rollbackVisible: false,
            entrustVisible: false,
            selectUserVisible: false,
            dataForm: {
                id: '',
                creator: '',
                createDate: '',
                instanceId: '',
                leaveDays: '',
                leaveReason: '',
                beginDate: '',
                endDate: '',
                taskId: '',
                comment: '',
                handle: '',
                entrustUserId: '',
                entrustUserName: '',
                processInstanceId: ''
            },
            handleOptions: [
                {
                    value: '1',
                    label: this.$t('leave.completeTask')
                }, {
                    value: '2',
                    label: this.$t('leave.rejectTask')
                }, {
                    value: '3',
                    label: this.$t('leave.doBackRollback')
                }, {
                    value: '4',
                    label: this.$t('leave.entrustTask')
                }, {
                    value: '5',
                    label: this.$t('leave.terminationTask')
                }],
            value: '',
            options: '',
            activityId: ''
        };
    },
    computed: {
        dataRule() {
            return {
                leaveDays: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ],
                leaveReason: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ],
                beginDate: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ],
                endDate: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ],
                comment: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ],
                handle: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ]
            };
        }
    },
    methods: {
        init() {
            this.visible = true;
            this.innerVisible = false;
            this.checkVisible = false;
            this.rollbackVisible = false;
            this.entrustVisible = false;
            this.selectUserVisible = false;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.id) {
                    this.getInfo();
                }
            });
        },
        // 获取信息
        getInfo() {
            this.$http.get(`/demo/leave/${this.dataForm.id}`).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.dataForm.handle = '';
                this.dataForm = {
                    ...this.dataForm,
                    ...res.data
                };
            }).catch(() => {});
        },
        // 选择操作
        handleChange() {
            this.dataForm.entrustUserId = '';
            this.dataForm.entrustUserName = '';
            this.dataForm.comment = '';
            if (this.dataForm.handle === '1' || this.dataForm.handle === '2' || this.dataForm.handle === '5') {
                this.checkVisible = true;
                this.rollbackVisible = false;
                this.entrustVisible = false;
            } else if (this.dataForm.handle === '3') {
                this.rollbackVisible = true;
                this.checkVisible = true;
                this.entrustVisible = false;
                this.rollbackTask();
            } else if (this.dataForm.handle === '4') {
                this.entrustVisible = true;
                this.rollbackVisible = false;
                this.checkVisible = false;
            }
        },
        // 通过
        completeTask: debounce(function() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                if (!this.dataForm.taskId) {
                    return false;
                }
                var params = qs.stringify({
                    'taskId': this.dataForm.taskId,
                    'comment': this.dataForm.comment
                });
                this.$http.post('/act/task/complete?' + params).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg);
                    }
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false;
                            this.$emit('refreshDataList');
                        }
                    });
                }).catch(() => {});
            });
        }, 1000, { 'leading': true, 'trailing': false }),
        // 驳回
        rejectTask: debounce(function() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                if (!this.dataForm.taskId) {
                    return false;
                }
                var params = qs.stringify({
                    'taskId': this.dataForm.taskId,
                    'comment': this.dataForm.comment
                });
                this.$http['post']('/act/task/backToFristStep?', params).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg);
                    }
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false;
                            this.$emit('refreshDataList');
                        }
                    });
                });
            });
        }, 1000, { 'leading': true, 'trailing': false }),
        // 查看课回退任务节点
        rollbackTask: debounce(function() {
            if (!this.dataForm.taskId) {
                return false;
            }
            var params = qs.stringify({
                'taskId': this.dataForm.taskId
            });
            this.$http['post']('/act/task/queryBackTasks?', params).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.options = res.data;
            });
        }, 1000, { 'leading': true, 'trailing': false }),
        // 回退指定节点
        doBackRollback() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                var params = qs.stringify({
                    'activityId': this.activityId,
                    'processInstanceId': this.dataForm.processInstanceId,
                    'comment': this.dataForm.comment
                });
                this.$http['post']('/act/task/doBackTheTask?', params).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg);
                    }
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false;
                            this.innerVisible = false;
                            this.$emit('refreshDataList');
                        }
                    });
                });
            });
        },
        // 取消回退
        cancelRollback() {
            this.innerVisible = false;
        },
        cancelHandle() {
            this.visible = false;
        },
        commitHandle() {
            var handle = this.dataForm.handle;
            switch (handle) {
                case '1':
                    this.completeTask();
                    break;
                case '2':
                    this.rejectTask();
                    break;
                case '3':
                    this.doBackRollback();
                    break;
                case '4':
                    this.entrustTask();
                    break;
                case '5':
                    this.terminationTask();
            }
        },
        // 终止
        terminationTask: debounce(function() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                if (!this.dataForm.taskId) {
                    return false;
                }
                var task = qs.stringify({
                    taskId: this.dataForm.taskId,
                    comment: this.dataForm.comment
                });
                this.$http['post']('/act/task/endProcess', task).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg);
                    }
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false;
                            this.$emit('refreshDataList');
                        }
                    });
                }).catch(() => {});
            });
        }, 1000, { 'leading': true, 'trailing': false }),
        // 委托
        entrustTask() {
            console.log(this.dataForm);
            if (!this.dataForm.entrustUserId) {
                this.$message.error('请选择委托人！');
                return;
            }
            var task = qs.stringify({
                taskId: this.dataForm.taskId,
                assignee: this.dataForm.entrustUserId
            });
            this.$http['post']('/act/task/changeTaskAssignee', task).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.$message({
                    message: this.$t('prompt.success'),
                    type: 'success',
                    duration: 500,
                    onClose: () => {
                        this.visible = false;
                        this.$emit('refreshDataList');
                    }
                });
            }).catch(() => {});
        },
        selectUserInfo() {
            this.selectUserVisible = true;
            this.$nextTick(() => {
                this.$refs.selectUser.dataForm.id = '';
                this.$refs.selectUser.init(this.setUserInfo);
            });
        },
        setUserInfo(userInfo) {
            console.log(userInfo);
            this.dataForm.entrustUserId = userInfo.id;
            this.dataForm.entrustUserName = userInfo.realName;
        }
    }
};
</script>
