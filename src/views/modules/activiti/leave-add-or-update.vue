<template>
    <el-dialog
        :visible.sync="visible"
        :title="!dataForm.id ? $t('add') : $t('update')"
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
                <el-input-number
                    v-model="dataForm.leaveDays"
                    :placeholder="$t('leave.leaveDays')"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.beginDate')"
                prop="beginDate">
                <el-date-picker
                    v-model="dataForm.beginDate"
                    :placeholder="$t('leave.beginDate')"
                    type="date"
                    value-format="yyyy-MM-dd"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.endDate')"
                prop="endDate">
                <el-date-picker
                    v-model="dataForm.endDate"
                    :placeholder="$t('leave.endDate')"
                    type="date"
                    value-format="yyyy-MM-dd"/>
            </el-form-item>
            <el-form-item
                :label="$t('leave.leaveReason')"
                prop="leaveReason">
                <el-input
                    v-model="dataForm.leaveReason"
                    :placeholder="$t('leave.leaveReason')"/>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">
                {{ $t('cancel') }}
            </el-button>
            <el-button
                type="primary"
                @click="dataFormSubmitHandle()">
                {{ $t('confirm') }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: '',
                creator: '',
                createDate: '',
                instanceId: '',
                leaveDays: '',
                leaveReason: '',
                beginDate: '',
                endDate: ''
            }
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
                ]
            };
        }
    },
    methods: {
        init() {
            this.visible = true;
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
                this.dataForm = {
                    ...this.dataForm,
                    ...res.data
                };
            }).catch(() => {});
        },
        // 表单提交
        dataFormSubmitHandle: debounce(function() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                this.$http[!this.dataForm.id ? 'post' : 'put']('/demo/leave/', this.dataForm).then(({ data: res }) => {
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
        }, 1000, { 'leading': true, 'trailing': false })
    }
};
</script>
