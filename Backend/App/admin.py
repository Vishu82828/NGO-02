from django.contrib import admin
from .models import Member

class MemberAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'phone', 'status')
    list_filter = ('status',)
    search_fields = ('email', 'phone')
    actions = ['approve_members', 'reject_members']
    
    def approve_members(self, request, queryset):
        queryset.update(status='approved')
    approve_members.short_description = "Approve selected members"
    
    def reject_members(self, request, queryset):
        queryset.update(status='rejected')
    reject_members.short_description = "Reject selected members"

admin.site.register(Member, MemberAdmin)
